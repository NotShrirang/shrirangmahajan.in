import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { resetConsent } from "../lib/consent";

const social = [
  { label: "GitHub", href: "https://github.com/NotShrirang" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shrirang-mahajan" },
  { label: "X", href: "https://x.com/notshrirang" },
  { label: "Hugging Face", href: "https://huggingface.co/NotShrirang" },
  { label: "Kaggle", href: "https://www.kaggle.com/notshrirang" },
  { label: "Email", href: "mailto:shrirangmahajan123@gmail.com" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.colWide}>
          <div className={styles.mark}>
            <span className={styles.markBig}>SM</span>
            <span className={styles.markRule} />
          </div>
          <p className={styles.tag}>
            <em>In search of global maximum.</em>
          </p>
          <p className={styles.reach}>
            Reach me at{" "}
            <a
              href="mailto:shrirangmahajan123@gmail.com"
              className={styles.reachLink}
            >
              shrirangmahajan123@gmail.com
            </a>
          </p>
          <p className={styles.meta}>
            Built without templates. Source on{" "}
            <a
              href="https://github.com/NotShrirang/shrirangmahajan.in"
              className={styles.inlineLink}
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub ›
            </a>
            .
          </p>
        </div>

        <div className={styles.col}>
          <div className={styles.colLabel}>Sections</div>
          <ul className={styles.list}>
            <li>
              <Link to="/projects">Work</Link>
            </li>
            <li>
              <Link to="/blogs">Writing</Link>
            </li>
            <li>
              <Link to="/experience">Experience</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <div className={styles.colLabel}>Elsewhere</div>
          <ul className={styles.list}>
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label} ›
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <div className={styles.colLabel}>View</div>
          <ul className={styles.list}>
            <li>
              <Link to="/jupyter" className={styles.jupyter}>
                Jupyter mode ›
              </Link>
            </li>
          </ul>
          <p className={styles.fine}>
            For ML engineers who miss <code>.ipynb</code>.
          </p>

          <div className={styles.colLabel} style={{ marginTop: "1.6rem" }}>
            Legal
          </div>
          <ul className={styles.list}>
            <li>
              <Link to="/privacy">Privacy policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms &amp; conditions</Link>
            </li>
            <li>
              <Link to="/cookies">Cookie policy</Link>
            </li>
            <li>
              {/* A real button: withdrawing consent must be as reachable as
                  giving it, and this is the route back to the banner. */}
              <button
                type="button"
                className={styles.consentBtn}
                onClick={() => {
                  resetConsent();
                  window.dispatchEvent(new CustomEvent("sm:consent-reopen"));
                }}
              >
                Cookie settings
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomRow}>
          <span>© {new Date().getFullYear()} Shrirang Mahajan</span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <span>Pune, Maharashtra, India</span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          <a href="mailto:shrirangmahajan123@gmail.com">
            shrirangmahajan123@gmail.com
          </a>
        </div>
        <p className={styles.imprint}>
          A personal portfolio operated by an individual. Nothing is sold here
          and no payments are taken — see the{" "}
          <Link to="/terms" className={styles.imprintLink}>
            terms
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
