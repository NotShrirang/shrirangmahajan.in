import React, { useState, useEffect } from "react";
import styles from "./ContactPage.module.css";
import MarkdownCell from "../../components/MarkdownCell/MarkdownCell";
import Cell from "../../components/Cell/Cell";
import getTheme from "../../utils/theme";

const ContactPage = () => {
  const [activeCell, setActiveCell] = useState(1);
  const [name, setName] = useState("");

  useEffect(() => {
    document.title = "Contact | Shrirang Mahajan";
  }, []);

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
                        name = "
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={styles.contactPageInputField}
                        />
                        "
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
                      <code className={styles.contactPageCode}>
                        name = "
                        <input
                          type="text"
                          value={name}
                          className={styles.contactPageInputField}
                          disabled
                        />
                        "
                      </code>
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
