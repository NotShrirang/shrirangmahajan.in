import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Contact.module.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  // idle | sending | sent | incomplete | noConsent | error
  const [state, setState] = useState("idle");

  useEffect(() => {
    document.title = "Contact — Shrirang Mahajan";
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setState("incomplete");
      return;
    }
    // Consent is the legal basis for processing this message, so it is
    // checked before anything is sent — not assumed from the click.
    if (!consent) {
      setState("noConsent");
      return;
    }
    setState("sending");
    try {
      const id = import.meta.env.VITE_FORMSPREE;
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Submit failed");
      setState("sent");
      setName("");
      setEmail("");
      setMessage("");
      setConsent(false);
    } catch (err) {
      setState("error");
    }
  };

  const STATUS = {
    sent: { cls: styles.status, text: "Got it — I'll get back to you soon." },
    incomplete: {
      cls: styles.statusError,
      text: "Please fill in your name, email and message.",
    },
    noConsent: {
      cls: styles.statusError,
      text: "Please tick the consent box so I'm allowed to reply to you.",
    },
    error: {
      cls: styles.statusError,
      text: "Something failed on the way out. Try emailing me directly instead?",
    },
  };
  const status = STATUS[state];

  return (
    <article className={styles.article}>
      <header className={styles.head}>
        <div className={styles.kicker}>
          <span>04</span>
          <span className={styles.kickerRule} />
          <span>Contact</span>
        </div>
        <h1 className={styles.title}>
          Let's <em>talk.</em>
        </h1>
        <p className={styles.lede}>
          A note, a question, a problem you're trying to solve — send it along.
          I read everything and reply to most.
        </p>
      </header>

      <div className={styles.grid}>
        <section className={styles.formSection}>
          <form onSubmit={submit} className={styles.form}>
            <label className={styles.field}>
              <span className={styles.label}>Your name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@analytic.engine"
                required
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi Shrirang, I'm working on..."
                rows={6}
                required
                className={styles.textarea}
              />
            </label>

            <div className={styles.consent}>
              <input
                type="checkbox"
                id="contact-consent"
                className={styles.consentBox}
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <label htmlFor="contact-consent" className={styles.consentLabel}>
                I agree that Shrirang may store my name, email and message in
                order to reply to me. The form is delivered via Formspree (US)
                and kept for up to 24 months. No marketing, ever — and you can
                ask me to delete it at any time. See the{" "}
                <Link to="/privacy" className={styles.consentLink}>
                  privacy policy
                </Link>
                .
              </label>
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submit}
                disabled={state === "sending"}
              >
                <span className={styles.submitLabel}>
                  {state === "sending" ? "Sending…" : "Send message"}
                </span>
                <span className={styles.submitArr} aria-hidden="true">
                  ›
                </span>
              </button>
            </div>

            {/* One live region, always present, so a screen reader announces
                success and failure alike instead of only what happens to be
                mounted at the time. */}
            <p className={styles.statusRegion} role="status" aria-live="polite">
              {status && <span className={status.cls}>{status.text}</span>}
            </p>
          </form>
        </section>

        <aside className={styles.side}>
          <div className={styles.sideBlock}>
            <div className={styles.sideLabel}>Direct</div>
            <a
              href="mailto:shrirangmahajan123@gmail.com"
              className={styles.sideValue}
            >
              shrirangmahajan123@gmail.com
            </a>
          </div>

          <div className={styles.sideBlock}>
            <div className={styles.sideLabel}>Elsewhere</div>
            <ul className={styles.sideList}>
              <li>
                <a
                  href="https://github.com/NotShrirang"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub <span>›</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/shrirang-mahajan"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  LinkedIn <span>›</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/notshrirang"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  X <span>›</span>
                </a>
              </li>
              <li>
                <a
                  href="https://huggingface.co/NotShrirang"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Hugging Face <span>›</span>
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.sideBlock}>
            <div className={styles.sideLabel}>Time zone</div>
            <div className={styles.sideValue}>IST (UTC+5:30) · Pune, India</div>
          </div>

          <div className={styles.note}>
            <em>
              Best response time on weekdays. Cold pitches that look automated
              get archived.
            </em>
          </div>
        </aside>
      </div>
    </article>
  );
}
