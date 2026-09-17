import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ContactPage.module.css";
import MarkdownCell from "../../components/MarkdownCell/MarkdownCell";
import Cell from "../../components/Cell/Cell";
import getTheme from "../../utils/theme";
import Footer from "../../components/Footer/Footer";

const ContactPage = () => {
  const [activeCell, setActiveCell] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  // idle | sending | sent | incomplete | noConsent | error
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    document.title = "Contact | Shrirang Mahajan";
  }, []);

  const STATUS_TEXT = {
    sending: "Sending…",
    sent: "Message sent. I'll get back to you soon.",
    incomplete: "Please fill in your name, email and message.",
    noConsent: "Please tick the consent box so I'm allowed to reply to you.",
    error: "Message could not be sent. Please email me directly instead.",
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!name || !email || !message) {
      setStatus("incomplete");
      return;
    }
    // Consent is the legal basis for processing this message — check it
    // before anything leaves the browser.
    if (!consent) {
      setStatus("noConsent");
      return;
    }
    setStatus("sending");

    const myForm = import.meta.env.VITE_FORMSPREE;
    const url = `https://formspree.io/f/${myForm}`;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setStatus("sent");
          setName("");
          setEmail("");
          setMessage("");
          setConsent(false);
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactPageContainer}>
        <div className={styles.contactPageContent}>
          <div className={styles.contactPageItemList}>
            <MarkdownCell
              cell={{
                id: 1,
                output: (
                  <div className={styles.markdownContainer}>
                    <div className={styles.contactPageTitle}>Contact Me</div>
                    <div className={styles.contactPageDescription}>
                      You can reach me at{" "}
                      <a href="mailto:shrirangmahajan123@gmail.com">
                        shrirangmahajan123@gmail.com
                      </a>
                    </div>
                  </div>
                ),
              }}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
            />
            <MarkdownCell
              cell={{
                id: 2,
                output: (
                  <div className={styles.markdownContainer}>
                    <div className={styles.contactPageDescription}>
                      Or fill out the form below and I will get back to you as
                      soon as possible.
                    </div>
                    {/* A real <form> with real <label for=...> pairs. The
                        submit control lives in a later cell, so it links back
                        here with the form="" attribute — which keeps
                        Enter-to-submit and correct labelling intact. */}
                    <form
                      id="jupyter-contact-form"
                      className={styles.contactPageForm}
                      onSubmit={handleSubmit}
                    >
                      <div className={styles.contactPageFormFields}>
                        <label htmlFor="jupyter-contact-name">Name:</label>{" "}
                        <input
                          id="jupyter-contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          className={styles.contactPageInputField}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className={styles.contactPageFormFields}>
                        <label htmlFor="jupyter-contact-email">Email:</label>{" "}
                        <input
                          id="jupyter-contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className={styles.contactPageInputField}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className={styles.contactPageFormFields}>
                        <label htmlFor="jupyter-contact-message">
                          Message:
                        </label>{" "}
                        <textarea
                          id="jupyter-contact-message"
                          name="message"
                          rows={5}
                          required
                          className={styles.contactPageInputField}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                      <div className={styles.contactPageConsent}>
                        <input
                          id="jupyter-contact-consent"
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          required
                        />
                        <label htmlFor="jupyter-contact-consent">
                          I agree that Shrirang may store my name, email and
                          message in order to reply to me. Delivered via
                          Formspree (US), kept up to 24 months, deleted on
                          request. See the{" "}
                          <Link to="/privacy">privacy policy</Link>.
                        </label>
                      </div>
                    </form>
                  </div>
                ),
              }}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
            />
            <MarkdownCell
              cell={{
                id: 3,
                output: (
                  <div className={styles.markdownContainer}>
                    <div className={styles.contactPageDescription}>
                      <code className={styles.contactPageCode}>
                        <span>
                          <span
                            style={{
                              color:
                                getTheme() === "light" ? "#0f37bc" : "#64b5f6",
                            }}
                          >
                            import
                          </span>{" "}
                          portfolio
                          <br />
                          <br />
                          <span style={{ color: "#479AFF" }}>name</span> = "
                          {name}"
                          <br />
                          <span style={{ color: "#479AFF" }}>email</span> = "
                          {email}"
                          <br />
                          <span style={{ color: "#479AFF" }}>message</span> = "
                          {message}"
                          <br />
                          <br />
                          <span>portfolio</span>.
                          <span style={{ color: "#479AFF" }}>send_message</span>
                          (<span style={{ color: "#479AFF" }}>name</span>,{" "}
                          <span style={{ color: "#479AFF" }}>email</span>,{" "}
                          <span style={{ color: "#479AFF" }}>message</span>)
                          <br />
                        </span>
                      </code>
                    </div>
                  </div>
                ),
              }}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
            />
            <MarkdownCell
              cell={{
                id: 4,
                output: (
                  <div className={styles.markdownContainer}>
                    <div className={styles.contactPageDescription}>
                      <button
                        type="submit"
                        form="jupyter-contact-form"
                        className={styles.contactPageButton}
                        disabled={status === "sending"}
                      >
                        <img
                          src={`https://img.icons8.com/?size=100&id=59862&format=png&color=${
                            getTheme() == "dark" ? "BDBDBD" : "616161"
                          }`}
                          alt=""
                          className={styles.controlIcon}
                        />{" "}
                        {status === "sending" ? "Sending…" : "Send message"}
                      </button>
                      {/* Replaces the old alert() calls: announced politely to
                          screen readers, and it doesn't steal focus. */}
                      <p
                        className={styles.contactPageStatus}
                        role="status"
                        aria-live="polite"
                      >
                        {STATUS_TEXT[status] || ""}
                      </p>
                    </div>
                  </div>
                ),
              }}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
