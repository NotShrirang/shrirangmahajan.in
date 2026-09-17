/*
 * The site's static routes, in one place.
 *
 * Consumed by scripts/prerender.js (which appends the blog slugs from
 * ./blogs/index.js, so posts are never hardcoded) and by
 * scripts/generate-sitemap.js. If you add a <Route> in App.jsx, add it here
 * too — prerender.js fails the build if a listed route renders nothing, but
 * it cannot know about a route you never told it about.
 *
 * Jupyter mode (/jupyter/*) is deliberately excluded: it is an alternate view
 * of the same content, so prerendering it would publish a second indexable
 * copy of every page and compete with the canonical one.
 */

export const SITE_ORIGIN = "https://www.shrirangmahajan.in";

/* No trailing slashes anywhere. vercel.json sets `trailingSlash: false`, so
   /projects/ 308-redirects to /projects — these are the post-redirect URLs,
   which is what belongs in a canonical tag and a sitemap.

   `description` becomes the page's <meta name="description">, og:description
   and twitter:description. Aim for 150–160 characters: past roughly that,
   Google truncates the snippet mid-sentence.

   "/" repeats index.html's description verbatim. It is 334 characters, so
   Google truncates it mid-sentence — but it is also the one snippet already
   indexed, and shortening it is a call to make deliberately rather than as a
   side effect of this change. It is here so that navigating back to the
   homepage restores it; without an entry the previous page's description
   would linger in the <head>. */
export const staticRoutes = [
  {
    path: "/",
    changefreq: "weekly",
    priority: "1.0",
    description:
      "Hey there! I'm Shrirang Mahajan — a Machine Learning & LLM Engineer based in Pune, India. I train LLMs from scratch, fine-tune them, and build multimodal RAG, AI agents, and production ML systems. Skilled in PyTorch, Hugging Face, LangChain, and FastAPI. Check out TinyGPT, LoomRAG, and AgentFlow with live demos and open-source code!",
  },
  {
    path: "/projects",
    changefreq: "monthly",
    priority: "0.9",
    description:
      "Machine learning and LLM projects by Shrirang Mahajan — TinyGPT, Tensorax, AgentFlow, LoomRAG and more, each with its source code on GitHub.",
  },
  {
    path: "/blogs",
    changefreq: "weekly",
    priority: "0.9",
    description:
      "Long-form, illustrated essays on attention, embeddings, CUDA kernels and pre-training language models on consumer hardware.",
  },
  {
    path: "/experience",
    changefreq: "monthly",
    priority: "0.9",
    description:
      "Work history of Shrirang Mahajan — Machine Learning Engineer II at Skylark Labs, previously Emergys, Atomic Loops and Nishikawa Communications.",
  },
  {
    path: "/tinygpt",
    changefreq: "monthly",
    priority: "0.9",
    description:
      "TinyGPT is a 95M-parameter LLM pre-trained from scratch on a single 8GB GPU. Read its architecture and training details, or run it in your browser.",
  },
  {
    path: "/contact",
    changefreq: "yearly",
    priority: "0.6",
    description:
      "Get in touch with Shrirang Mahajan — send a message or reach me by email. Based in Pune, India (IST, UTC+5:30).",
  },
  {
    path: "/privacy",
    changefreq: "yearly",
    priority: "0.3",
    description:
      "What this site collects, which third parties receive it, how long it is kept, and how to ask for it to be deleted.",
  },
  {
    path: "/terms",
    changefreq: "yearly",
    priority: "0.3",
    description:
      "The terms for using shrirangmahajan.in — a personal portfolio that sells nothing — plus disclaimers for its two AI features.",
  },
  {
    path: "/cookies",
    changefreq: "yearly",
    priority: "0.3",
    description:
      "Every cookie and storage key this site can set, what each one is for, and how to refuse or withdraw consent at any time.",
  },
];

/** Route path for a blog slug. The slug is used raw — see encodePath(). */
export const blogPath = (slug) => `/blogs/${slug}`;

/**
 * Percent-encode a route path for use in a URL (canonical tag, og:url,
 * sitemap <loc>).
 *
 * Two of the slugs carry characters that are legal in a path segment but must
 * not appear raw in XML or in a canonical URL:
 *
 *   writing-cuda-kernels-from-scratch-a-beginner's-guide          →  %27
 *   from-words-to-meaning:-the-journey-from-word-vectors-…        →  %3A
 *
 * encodeURIComponent() is applied per segment so the "/" separators survive.
 * On its own it is not enough: it deliberately leaves ! ' ( ) * unescaped,
 * so the apostrophe slug would come out raw. The extra pass below encodes
 * those too, which is what gets the CUDA post to %27.
 */
export const encodePath = (path) =>
  path
    .split("/")
    .map((seg) =>
      encodeURIComponent(seg).replace(
        /[!'()*]/g,
        (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
      )
    )
    .join("/");

/** Absolute, percent-encoded URL for a route path. */
export const absoluteUrl = (path) => `${SITE_ORIGIN}${encodePath(path)}`;
