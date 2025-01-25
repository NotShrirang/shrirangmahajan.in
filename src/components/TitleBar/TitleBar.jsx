import React, { useState, useEffect } from "react";
import styles from "./TitleBar.module.css";
import profilePic from "../../assets/shrirang.png";
import formatDate from "../../utils/DateUtil";

const TitleBar = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
    const loadedTime = new Date();
    localStorage.setItem("loadedTime", loadedTime);
  }, []);

  return (
    <div className={styles.titleBarContainer}>
      <div className={styles.titleBarContent}>
        <div className={styles.nameComponent}>
          <a href="/" className={styles.profileImageContainer}>
            <img
              src={profilePic}
              alt="Shrirang Mahajan"
              className={styles.profileImage}
            />
          </a>
          <div className={styles.name}>Shrirang Mahajan - Portfolio.ipynb</div>
          <div className={styles.lastCheckpoint}>
            Last Checkpoint: {formatDate(localStorage.getItem("loadedTime"))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
