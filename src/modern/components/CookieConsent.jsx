import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CookieConsent.module.css";
import {
  initConsent,
  readConsent,
  grantAnalyticsConsent,
  denyAnalyticsConsent,
  onConsentChange,
} from "../lib/consent";

/*
 * Consent banner for the one non-essential tracker on this site (Google
 * Analytics). Two rules it is built around:
 *
 *   1. Nothing loads before a choice is made. initConsent() only re-applies a
 *      stored *grant*; with no stored decision it loads nothing.
 *   2. Refusing is exactly as easy as accepting — same shape, same weight,
 *      same number of clicks. A prominent "Accept" beside a buried "Reject"
 *      is what regulators have repeatedly ruled is not freely given consent.
 */
export default function CookieConsent() {
  const [decided, setDecided] = useState(true); // assume decided until checked
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // scripts/prerender.js sets this flag. Without it the banner is captured
    // into every static page: a returning visitor who already chose would see
    // it flash before React re-renders, and crawlers would index it on every
    // route. Nothing is lost by omitting it — with JS off the buttons cannot
    // work and no analytics loads in the first place.
    if (window.__PRERENDER__) return undefined;
    const record = initConsent();
    setDecided(record !== null);
    setMounted(true);
    return onConsentChange((next) => setDecided(next !== null));
  }, []);

  // Let a "Cookie settings" link anywhere on the site re-open this.
  useEffect(() => {
    const reopen = () => setDecided(readConsent() !== null);
    window.addEventListener("sm:consent-reopen", reopen);
    return () => window.removeEventListener("sm:consent-reopen", reopen);
  }, []);

  if (!mounted || decided) return null;

  return (
    <div
      className={styles.wrap}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className={styles.panel}>
        <div className={styles.copy}>
          <h2 className={styles.title} id="cookie-consent-title">
            A word about cookies
          </h2>
          <p className={styles.desc} id="cookie-consent-desc">
            This site needs no cookies to work, and sets none by default. I'd
            like to switch on <strong>Google Analytics</strong> to see which
            posts get read — it stores a cookie on your device. Entirely your
            call, and you can change it later from the footer.{" "}
            <Link to="/cookies" className={styles.link}>
              Cookie policy
            </Link>
            <span className={styles.sep} aria-hidden="true">
              ·
            </span>
            <Link to="/privacy" className={styles.link}>
              Privacy policy
            </Link>
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => denyAnalyticsConsent()}
          >
            Reject analytics cookies
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => grantAnalyticsConsent()}
          >
            Accept analytics cookies
          </button>
        </div>
      </div>
    </div>
  );
}
