/*
 * Build-time prerender.
 *
 * The problem this solves: every route was served the same dist/index.html,
 * whose <noscript> fallback describes the homepage and whose canonical tag
 * is hardcoded to "/". Google saw one page with a canonical pointing at the
 * root and duplicate homepage body text, so every route but home was
 * effectively deindexed.
 *
 * What this does, after `vite build`:
 *   1. Collects routes — static ones from src/data/routes.js, blog posts from
 *      src/data/blogs/index.js, so adding a post needs no change here.
 *   2. Serves dist/ locally with the same SPA fallback Vercel applies.
 *   3. Renders each route in headless Chrome and snapshots the resulting HTML.
 *   4. Rewrites canonical / og:url / og:title / twitter tags to that route's
 *      real URL, and drops the homepage <noscript> block from non-home pages.
 *   5. Writes dist/<route>/index.html, plus a sitemap generated from the same
 *      route list so the two can never drift.
 *
 * Deterministic by construction: all cross-origin requests are blocked, so a
 * slow font CDN or a rate-limited GitHub API cannot change the output or hang
 * networkidle0.
 */

import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { build as esbuild } from "esbuild";
import handler from "serve-handler";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const NAV_TIMEOUT_MS = 45_000;

/* ───────────────────────── route collection ───────────────────────── */

/*
 * src/data/blogs/index.js imports cover images and lazily imports the post
 * JSX, so Node cannot load it directly. Bundle it with esbuild first, with
 * assets and .jsx stubbed out — we only want the metadata array, and the
 * slugs in it must come from the real source rather than a copy that rots.
 */
async function loadBlogSlugs() {
  const stub = {
    name: "stub-non-js",
    setup(b) {
      b.onResolve({ filter: /\.(png|jpe?g|gif|svg|webp|avif|css|ttf|woff2?)$/ }, (a) => ({
        path: a.path,
        namespace: "stub",
      }));
      // The `load: () => import("./Post.jsx")` thunks pull in thousands of
      // lines of post content we do not need to read a slug.
      b.onResolve({ filter: /\.jsx$/ }, (a) => ({ path: a.path, namespace: "stub" }));
      b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
        contents: "export default {};",
        loader: "js",
      }));
    },
  };

  const out = await esbuild({
    entryPoints: [path.join(ROOT, "src/data/blogs/index.js")],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    logLevel: "silent",
    plugins: [stub],
  });

  const code = out.outputFiles[0].text;
  const mod = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  );
  const blogs = mod.default;
  if (!Array.isArray(blogs) || blogs.length === 0) {
    throw new Error("prerender: no blogs resolved from src/data/blogs/index.js");
  }
  return blogs;
}

/* ───────────────────────── browser ─────────────────────────
 *
 * Vercel's build image is Amazon Linux with no desktop libraries, so a stock
 * Chrome download dies with "libnspr4.so: cannot open shared object file".
 * @sparticuz/chromium ships a Linux x64 Chromium that bundles the libraries
 * it needs, which is why it is the primary path — and because it also runs on
 * an ordinary Linux dev box, local builds exercise exactly what CI runs.
 *
 * It has no macOS or Windows build, so those fall back to a system Chrome.
 */

const SYSTEM_CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

const BASE_ARGS = ["--no-sandbox", "--disable-dev-shm-usage"];

async function launchViaSparticuz() {
  const chromium = (await import("@sparticuz/chromium")).default;

  // No WebGL is needed to serialise HTML, and turning it off drops the
  // swiftshader/ANGLE flags along with their memory and startup cost.
  chromium.setGraphicsMode = false;

  const executablePath = await chromium.executablePath();

  /* Strip the two flags tuned for Lambda's memory ceiling. --single-process
     (and its companion --no-zygote) makes Chrome crash-prone once you drive
     it across many navigations, which is exactly what this script does.
     --headless is dropped in favour of the explicit option below so there is
     one source of truth. */
  const args = [
    ...chromium.args.filter(
      (a) =>
        !a.startsWith("--single-process") &&
        !a.startsWith("--no-zygote") &&
        !a.startsWith("--headless")
    ),
    ...BASE_ARGS,
  ];

  return puppeteer.launch({ args, executablePath, headless: "shell" });
}

async function launchViaSystemChrome() {
  const found = SYSTEM_CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      "no system Chrome found (set CHROME_PATH to one)"
    );
  }
  return puppeteer.launch({
    executablePath: found,
    headless: "new",
    args: BASE_ARGS,
  });
}

async function launchBrowser() {
  try {
    const browser = await launchViaSparticuz();
    console.log("prerender: chromium via @sparticuz/chromium");
    return browser;
  } catch (err) {
    const why = err.message.split("\n")[0];
    console.log(`prerender: @sparticuz/chromium unavailable (${why})`);
    console.log("prerender: falling back to a system Chrome");
    try {
      const browser = await launchViaSystemChrome();
      console.log("prerender: chromium via system install");
      return browser;
    } catch (err2) {
      throw new Error(
        `could not start a browser.\n` +
          `  @sparticuz/chromium: ${why}\n` +
          `  system chrome:       ${err2.message.split("\n")[0]}\n` +
          `  On macOS or Windows, install Chrome or set CHROME_PATH.`
      );
    }
  }
}

/* ───────────────────────── local static server ───────────────────────── */

/* Mirrors Vercel's behaviour: a real file wins, anything else falls back to
   the SPA shell. Without the fallback, Chrome would get a 404 for /projects
   and render nothing. */
function startServer(dir) {
  return new Promise((resolve) => {
    const server = createServer((req, res) =>
      handler(req, res, {
        public: dir,
        cleanUrls: false,
        directoryListing: false,
        rewrites: [{ source: "**", destination: "/index.html" }],
      })
    );
    server.listen(0, "127.0.0.1", () =>
      resolve({ server, port: server.address().port })
    );
  });
}

/* ───────────────────────── HTML rewriting ───────────────────────── */

const escapeAttr = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Replace the `attr` value of the first tag matching `tagPattern`.
 * Returns [html, didReplace] so the caller can fail loudly rather than
 * silently shipping a page whose canonical never got rewritten.
 */
function setTagAttr(html, tagPattern, attr, value) {
  let replaced = false;
  const next = html.replace(tagPattern, (tag) => {
    replaced = true;
    const re = new RegExp(`(${attr}\\s*=\\s*")[^"]*(")`, "i");
    return re.test(tag)
      ? tag.replace(re, `$1${escapeAttr(value)}$2`)
      : tag.replace(/\s*\/?>$/, ` ${attr}="${escapeAttr(value)}">`);
  });
  return [next, replaced];
}

function rewriteHead(html, { url, isHome, title, description }) {
  const problems = [];
  let out = html;
  let ok;

  [out, ok] = setTagAttr(out, /<link[^>]*rel="canonical"[^>]*>/i, "href", url);
  if (!ok) problems.push("no <link rel=canonical> found");

  [out, ok] = setTagAttr(
    out,
    /<meta[^>]*property="og:url"[^>]*>/i,
    "content",
    url
  );
  if (!ok) problems.push("no og:url found");

  /* The app sets document.title per route, so the snapshot already carries
     the right <title>. The social tags are static in index.html, so they
     still say "homepage" on every route — sync them to what was rendered.

     `title` is the DECODED string from page.title(), not a regex grab of the
     serialised <title>: that text is already entity-encoded, and escaping it
     a second time turns "&amp;" into "&amp;amp;". */
  if (title) {
    [out] = setTagAttr(
      out,
      /<meta[^>]*property="og:title"[^>]*>/i,
      "content",
      title
    );
    [out] = setTagAttr(
      out,
      /<meta[^>]*name="twitter:title"[^>]*>/i,
      "content",
      title
    );
  }

  /* index.html ships one homepage description, so without this every route
     shares a single search snippet. Written here from the route data rather
     than read back out of the DOM: the runtime hook in Layout.jsx sets the
     same tags for client-side navigation, but depending on its timing would
     make the build racy. Both read src/data, so they agree.

     "/" deliberately has no description in the data — it keeps the one in
     index.html, which is already written for it and already indexed. */
  if (description) {
    const DESCRIPTION_TAGS = [
      ["description", /<meta[^>]*name="description"[^>]*>/i],
      ["og:description", /<meta[^>]*property="og:description"[^>]*>/i],
      ["twitter:description", /<meta[^>]*name="twitter:description"[^>]*>/i],
    ];
    for (const [name, pattern] of DESCRIPTION_TAGS) {
      [out, ok] = setTagAttr(out, pattern, "content", description);
      if (!ok) problems.push(`no <meta ${name}> found`);
    }
  } else if (!isHome) {
    problems.push("no description in src/data for this route");
  }

  /* The <noscript> block is a hand-written homepage summary. On a blog post
     it is duplicate off-topic body text — exactly the "every route serves
     homepage content" symptom. The prerendered DOM is now the no-JS
     fallback, so the block has no job to do anywhere but home. */
  if (!isHome) {
    out = out.replace(/<noscript>[\s\S]*?<\/noscript>/gi, (block) =>
      block.length > 400 ? "" : block
    );
  }

  return { html: out, problems };
}

/* ───────────────────────── main ───────────────────────── */

async function main() {
  const { staticRoutes, blogPath, absoluteUrl, encodePath, SITE_ORIGIN } =
    await import(path.join(ROOT, "src/data/routes.js"));

  const blogs = await loadBlogSlugs();
  const routes = [
    ...staticRoutes.map((r) => ({ ...r, kind: "static" })),
    ...blogs.map((b) => ({
      path: blogPath(b.slug),
      changefreq: "yearly",
      priority: "0.8",
      kind: "post",
      title: b.title,
      description: b.description,
    })),
  ];

  console.log(
    `prerender: ${routes.length} routes (${staticRoutes.length} static, ${blogs.length} posts)`
  );

  const { server, port } = await startServer(DIST);
  const origin = `http://127.0.0.1:${port}`;
  const browser = await launchBrowser();

  const failures = [];
  let homeTitle = null;

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      /* Lets components opt out of being captured into the static snapshot.
         Read by CookieConsent — see the note there. */
      await page.evaluateOnNewDocument(() => {
        window.__PRERENDER__ = true;
      });

      /* Block every cross-origin request. Google Fonts, the GitHub API and
         Vercel's analytics beacons cannot affect the emitted HTML, but any
         one of them can stall networkidle0 or make output vary run to run. */
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (req.url().startsWith(origin) || req.url().startsWith("data:")) {
          req.continue();
        } else {
          req.abort();
        }
      });

      const target = origin + encodePath(route.path);
      const isHome = route.path === "/";

      try {
        await page.goto(target, {
          waitUntil: "networkidle0",
          timeout: NAV_TIMEOUT_MS,
        });
        // The shell paints before React hydrates the route chunk; wait for
        // the router to actually put something in #root.
        await page.waitForFunction(
          () => {
            const r = document.getElementById("root");
            return r && r.innerText.trim().length > 200;
          },
          { timeout: NAV_TIMEOUT_MS }
        );

        const rendered = await page.content();
        const bodyText = await page.$eval("#root", (el) => el.innerText.trim());
        const pageTitle = await page.title();

        if (isHome) homeTitle = pageTitle;

        const url = absoluteUrl(route.path);
        const { html, problems } = rewriteHead(rendered, {
          url,
          isHome,
          title: pageTitle,
          description: route.description,
        });

        /* A route that fell through to the wrong component would still render
           fine and still be written to disk — this is the check that catches
           it. Every route the app knows about sets its own document.title. */
        if (!isHome && homeTitle && pageTitle === homeTitle) {
          problems.push(
            `title is identical to the homepage ("${pageTitle}") — route probably did not match`
          );
        }
        if (problems.length) {
          failures.push(`${route.path}: ${problems.join("; ")}`);
        }

        /* Decoded path on disk: Vercel resolves a decoded request path
           against the filesystem, so dist/blogs/llama-2-explained/index.html
           is what serves /blogs/llama-2-explained. */
        const outDir = isHome ? DIST : path.join(DIST, route.path);
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");

        console.log(
          `  ✓ ${route.path.padEnd(58)} ${String(bodyText.length).padStart(6)} chars`
        );
      } catch (err) {
        failures.push(`${route.path}: ${err.message.split("\n")[0]}`);
        console.log(`  ✗ ${route.path} — ${err.message.split("\n")[0]}`);
      } finally {
        await page.close();
      }
    }

    /* Sitemap from the same list, so it cannot drift from what was rendered:
       no trailing slashes (vercel.json sets trailingSlash: false) and every
       path percent-encoded, which is what fixes the two slugs carrying an
       apostrophe and a colon. */
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...routes.map((r) =>
        [
          "  <url>",
          `    <loc>${absoluteUrl(r.path)}</loc>`,
          `    <changefreq>${r.changefreq}</changefreq>`,
          `    <priority>${r.priority}</priority>`,
          "  </url>",
        ].join("\n")
      ),
      "</urlset>",
      "",
    ].join("\n");
    await fs.writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
    console.log(`  ✓ sitemap.xml (${routes.length} urls, origin ${SITE_ORIGIN})`);
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length) {
    console.error("\nprerender failed:");
    failures.forEach((f) => console.error("  - " + f));
    process.exit(1);
  }
  console.log("prerender: ok");
}

main().catch((err) => {
  console.error("prerender: fatal\n", err);
  process.exit(1);
});
