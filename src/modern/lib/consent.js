/* Cookie / analytics consent.
 *
 * Google Analytics is the only non-essential tracker on this site and it is
 * the only thing gated here: it sets first-party cookies (_ga, _ga_<id>) and
 * under the EU ePrivacy Directive those require *prior* opt-in. So nothing
 * Google-owned is loaded until the visitor actively grants consent — the
 * gtag.js <script> is injected from here, not from index.html.
 *
 * Vercel Analytics and Speed Insights are deliberately NOT gated: they are
 * cookieless and store no identifier on the device. They are disclosed in the
 * cookie policy as legitimate-interest aggregate measurement.
 */

export const CONSENT_KEY = "sm-cookie-consent-v1";
export const CONSENT_VERSION = 1;
export const GA_MEASUREMENT_ID = "G-1VWQMVR61X";

/** @typedef {{ analytics: boolean, version: number, at: string }} ConsentRecord */

const listeners = new Set();
let scriptInjected = false;

function safeLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch (e) {
    // Private mode / storage blocked. Treat as "no decision recorded".
    return null;
  }
}

/** @returns {ConsentRecord | null} null means the visitor has not decided yet. */
export function readConsent() {
  const store = safeLocalStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.analytics !== "boolean") return null;
    // A bumped version means the disclosure changed — ask again.
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeConsent(analytics) {
  const record = {
    analytics,
    version: CONSENT_VERSION,
    at: new Date().toISOString(),
  };
  const store = safeLocalStorage();
  if (store) {
    try {
      store.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch (e) {
      // Best effort — if we can't persist, the banner simply reappears.
    }
  }
  listeners.forEach((fn) => fn(record));
  return record;
}

/** Subscribe to consent changes. Returns an unsubscribe function. */
export function onConsentChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/* Inject gtag.js exactly once, and only ever after a grant. */
function injectAnalytics() {
  if (scriptInjected || typeof document === "undefined") return;
  scriptInjected = true;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    // We have no use for the last octet of a visitor's IP, and no use for
    // Google's advertising features. Collect the minimum that still answers
    // "which posts do people read".
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/* Delete the cookies GA already set on this domain. */
function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  // Strip one label at a time so we also hit cookies set on the registrable
  // domain (.shrirangmahajan.in) rather than only the exact host.
  const domains = [null, host, `.${host}`];
  const parts = host.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    domains.push(`.${parts.slice(i).join(".")}`);
  }
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;
    domains.forEach((d) => {
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
        (d ? `; domain=${d}` : "");
    });
  });
}

/** Visitor accepted analytics cookies. */
export function grantAnalyticsConsent() {
  const record = writeConsent(true);
  injectAnalytics();
  gtag("consent", "update", { analytics_storage: "granted" });
  return record;
}

/** Visitor rejected, or withdrew, analytics cookies. */
export function denyAnalyticsConsent() {
  const record = writeConsent(false);
  if (scriptInjected) {
    // gtag.js can't be unloaded once evaluated, so flip Consent Mode to
    // denied (it stops writing cookies and sends no further hits) and bin
    // whatever it already set.
    gtag("consent", "update", { analytics_storage: "denied" });
  }
  clearAnalyticsCookies();
  return record;
}

/** Re-open the banner so a visitor can change their mind. */
export function resetConsent() {
  const store = safeLocalStorage();
  if (store) {
    try {
      store.removeItem(CONSENT_KEY);
    } catch (e) {
      /* noop */
    }
  }
  clearAnalyticsCookies();
  listeners.forEach((fn) => fn(null));
}

/**
 * Called once on boot. Re-applies a previously stored grant; does nothing at
 * all when there is no stored decision, which is the point — no consent, no
 * Google script, no cookies.
 */
export function initConsent() {
  const record = readConsent();
  if (record?.analytics) {
    injectAnalytics();
    gtag("consent", "update", { analytics_storage: "granted" });
  }
  return record;
}
