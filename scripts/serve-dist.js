/*
 * Serve dist/ the way Vercel will, for verifying a prerendered build locally.
 *
 *   node scripts/serve-dist.js [port]
 *
 * Mirrors vercel.json: trailingSlash false (so /projects/ 308s to /projects),
 * filesystem before rewrites (so a prerendered dist/<route>/index.html wins),
 * and the SPA fallback only for paths that are neither an asset nor a file
 * with an extension.
 */

import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import handler from "serve-handler";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = Number(process.argv[2]) || 4173;

// Same negative lookahead as vercel.json's rewrite source.
const SPA_FALLBACK = /^\/(?!assets\/|_app\/)(?!.*\.[a-zA-Z0-9]+$).*$/;

/* serve-handler applies its own `rewrites` BEFORE looking at the filesystem,
   which is the opposite of Vercel — with a blanket rewrite every route would
   be served the SPA shell and a prerendered page would never be reachable.
   So resolve the filesystem here, first, exactly as Vercel does, and only
   fall back to the shell when nothing real matches. */
function resolveStatic(pathname) {
  const rel = pathname.replace(/^\/+/, "");
  const direct = path.join(DIST, rel);
  if (rel && existsSync(direct) && statSync(direct).isFile()) return "/" + rel;
  const asIndex = path.join(direct, "index.html");
  if (existsSync(asIndex) && statSync(asIndex).isFile())
    return "/" + path.posix.join(rel, "index.html");
  return null;
}

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const pathname = decodeURIComponent(url.pathname);

  // trailingSlash: false
  if (pathname.length > 1 && pathname.endsWith("/")) {
    res.writeHead(308, { Location: pathname.slice(0, -1) + url.search });
    return res.end();
  }

  const hit = resolveStatic(pathname);
  const destination = hit ?? (SPA_FALLBACK.test(pathname) ? "/index.html" : null);

  if (!destination) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("404");
  }

  req.url = destination + url.search;
  handler(req, res, {
    public: DIST,
    cleanUrls: false,
    directoryListing: false,
  });
}).listen(PORT, "127.0.0.1", () =>
  console.log(`serving dist/ on http://127.0.0.1:${PORT}`)
);
