import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <span className={styles.footerSpan}>
          Made with ❤️ by{" "}
          <a href="https://shrirangmahajan.in"> Shrirang Mahajan</a>
        </span>
        <iframe
          src="https://github.com/sponsors/NotShrirang/button"
          title="Sponsor NotShrirang"
          height="32"
          width="114"
          style={{ border: 0, borderRadius: 6 }}
        ></iframe>
        <span>©2025 Shrirang Mahajan. All rights reserved.</span>
      </div>
      <div className={styles.footerSocials}>
        <span>Follow me on:</span>
        <div className={styles.footerSocialHyperlinkRow}>
          <a
            href="https://x.com/notshrirang"
            className={styles.footerSocialHyperlink}
          >
            <img
              src={`https://img.icons8.com/?size=30&id=fJp7hepMryiw&format=png&color=${
                theme == "dark" ? "ffffff" : "000000"
              }`}
              alt="X"
            />
          </a>
          <a
            href="https://huggingface.co/NotShrirang"
            className={styles.footerSocialHyperlink}
          >
            <img
              src={`https://img.icons8.com/?size=30&id=sop9ROXku5bb&format=png&color=${
                theme == "dark" ? "ffffff" : "000000"
              }`}
              alt="Hugging Face"
            />
          </a>
          <a
            href="https://www.kaggle.com/notshrirang"
            className={styles.footerSocialHyperlink}
          >
            <img
              src={`https://img.icons8.com/?size=20&id=QrYhwpUzAcoy&format=png&color=${
                theme == "dark" ? "ffffff" : "000000"
              }`}
              alt="Kaggle"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/shrirang-mahajan"
            className={styles.footerSocialHyperlink}
          >
            <img
              src={`https://img.icons8.com/?size=30&id=13930&format=png&color=${
                theme == "dark" ? "ffffff" : "000000"
              }`}
              alt="LinkedIn"
            />
          </a>
          <a
            href="https://www.github.com/NotShrirang"
            className={styles.footerSocialHyperlink}
          >
            <img
              src={`https://img.icons8.com/?size=30&id=106564&format=png&color=${
                theme == "dark" ? "ffffff" : "000000"
              }`}
              alt="GitHub"
            />
          </a>
          <a
            href="mailto:shrirangmahajan123@gmail.com"
            className={styles.footerSocialHyperlink}
          >
            <img
              src={`https://img.icons8.com/?size=30&id=12580&format=png&color=${
                theme == "dark" ? "ffffff" : "000000"
              }`}
              alt="Email"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
