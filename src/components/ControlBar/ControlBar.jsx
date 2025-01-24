import React, { useState, useEffect } from "react";
import styles from "./ControlBar.module.css";

const ControlBar = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);

  return (
    <div className={styles.controlBarContainer}>
      <div className={styles.controlBarContent}>
        <div className={styles.controlComponent}>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=83208&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Save"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=3220&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Add New Cell"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=78648&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Cut Cell"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=86206&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Copy Cell"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=98219&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Paste Content"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=59862&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Run this cell"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=91463&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Stop execution"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=121812&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Restart Kernel"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=91476&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Restart Kernel and Run All Cells"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <select className={styles.controlSelect}>
              <option value="code">Code</option>
              <option value="ml">Machine Learning</option>
              <option value="web">Web</option>
              <option value="app">App</option>
            </select>
          </div>
          <div
            className={styles.controlItem}
            onClick={(e) => {
              e.preventDefault();
              // Set prefer-color-scheme to dark
            }}
          >
            <img
              src={`https://img.icons8.com/?size=100&id=67207&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Portfolio Guide"
              className={styles.controlIcon}
            />
          </div>
        </div>
        <div className={styles.kernelSettingsContainer}>
          <div
            className={styles.sourceCodeRedirectContainer}
            onClick={(e) => {
              e.preventDefault();
              window.open("https://github.com/NotShrirang/portfolio", "_blank");
            }}
          >
            <div className={styles.sourceCodeRedirectText}>Source</div>
            <img
              src={`https://img.icons8.com/?size=100&id=82787&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Open in new window"
              className={styles.sourceCodeRedirectIcon}
            />
          </div>
          <div className={styles.pythonItem}>Python</div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=37601&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Kernel Status"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.controlItem}>
            <img
              src={`https://img.icons8.com/?size=100&id=8113&format=png&color=${
                theme == "dark" ? "BDBDBD" : "616161"
              }`}
              alt="Menu"
              className={styles.controlIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
