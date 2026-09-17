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
   which is what belongs in a canonical tag and a sitemap. */
export const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/projects", changefreq: "monthly", priority: "0.9" },
  { path: "/blogs", changefreq: "weekly", priority: "0.9" },
  { path: "/experience", changefreq: "monthly", priority: "0.9" },
  { path: "/tinygpt", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
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
