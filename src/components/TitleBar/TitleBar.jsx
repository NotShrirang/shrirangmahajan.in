import React, { useState, useEffect } from "react";
import styles from "./TitleBar.module.css";
import profilePic from "../../assets/shrirang.png";

const TitleBar = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);

  return (
    <div className={styles.titleBarContainer}>
      <div className={styles.titleBarContent}>
        <div className={styles.nameComponent}>
          <a
            href="https://www.linkedin.com/in/shrirang-mahajan"
            className={styles.profileImageContainer}
          >
            <img
              src={profilePic}
              alt="Shrirang Mahajan"
              className={styles.profileImage}
            />
          </a>
          <div className={styles.name}>Shrirang Mahajan - Portfolio.ipynb</div>
          <div className={styles.lastCheckpoint}>
            Last Checkpoint: 7 days ago
          </div>
        </div>
        <div className={styles.githubIconContainer}>
          <a
            href="https://github.com/NotShrirang"
            className={styles.githubIconLink}
          >
            <img
              src={`https://img.icons8.com/?size=100&id=106564&format=png&color=${
                theme == "dark" ? "ffffff" : "000000"
              }`}
              alt="Shrirang's GitHub"
              className={styles.githubIcon}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
