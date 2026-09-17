/*
 * Resolve a route's meta description at runtime.
 *
 * scripts/prerender.js writes these tags into the static HTML at build time —
 * that is what search engines read, and it stays the source of truth. This
 * module covers the other half: once the app is running, a client-side
 * navigation changes the URL without reloading, so without it the <head>
 * would keep describing whichever page happened to load first.
 *
 * Both sides read the same data (staticRoutes here, `description` on each
 * blog entry), so they cannot disagree.
 *
 * Browser-only: importing blogs/index.js pulls in cover images, which is why
 * prerender.js combines the two lists itself instead of importing this.
 */

import { staticRoutes, blogPath } from "./routes";
import blogs from "./blogs";

/** @returns {string | null} null means "leave the document's default alone". */
export function descriptionFor(pathname) {
  // Tolerate a trailing slash even though vercel.json redirects it away —
  // client-side <Link>s could still produce one.
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const post = blogs.find((b) => blogPath(b.slug) === path);
  if (post) return post.description ?? null;

  const route = staticRoutes.find((r) => r.path === path);
  return route?.description ?? null;
}

/**
 * Point the description tags at `description`. A null description is left
 * alone rather than cleared: the homepage's own description is in index.html
 * and should survive.
 */
export function applyDescription(description) {
  if (!description || typeof document === "undefined") return;
  const selectors = [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ];
  for (const selector of selectors) {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute("content", description);
  }
}
