import React, { useState, useEffect } from "react";
import styles from "./ContactPage.module.css";
import MarkdownCell from "../../components/MarkdownCell/MarkdownCell";
import Cell from "../../components/Cell/Cell";
import getTheme from "../../utils/theme";

const ContactPage = () => {
  const [activeCell, setActiveCell] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Contact | Shrirang Mahajan";
  }, []);

  const handleSubmit = () => {
    const myForm = import.meta.env.VITE_FORMSPREE;
    const url = `https://formspree.io/f/${myForm}`;
    var formData = new FormData();
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
        if (response.status === 200) {
          alert("Message sent successfully!");
        } else {
          alert("Message could not be sent. Please try again later.");
        }
      })
      .catch((error) => {
        alert("Message could not be sent. Please try again later.");
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
                    <div className={styles.contactPageDescription}>
                      <font className={styles.contactPageForm}>
                        <div className={styles.contactPageFormFields}>
                          Name:{" "}
                          <input
                            type="text"
                            className={styles.contactPageInputField}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className={styles.contactPageFormFields}>
                          Email:{" "}
                          <input
                            type="email"
                            className={styles.contactPageInputField}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className={styles.contactPageFormFields}>
                          Message:{" "}
                          <textarea
                            type="text"
                            className={styles.contactPageInputField}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </font>
                    </div>
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
                        className={styles.contactPageButton}
                        onClick={handleSubmit}
                      >
                        <img
                          src={`https://img.icons8.com/?size=100&id=59862&format=png&color=${
                            getTheme() == "dark" ? "BDBDBD" : "616161"
                          }`}
                          alt="Run this cell"
                          className={styles.controlIcon}
                        />{" "}
                        Run Code
                      </button>
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
    </div>
  );
};

export default ContactPage;
