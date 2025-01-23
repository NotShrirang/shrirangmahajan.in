import React, { useState, useEffect } from "react";
import styles from "./MarkdownCell.module.css";

const MarkdownCell = ({ cell, activeCell, setActiveCell }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);
  return (
    <div
      className={styles.cell}
      style={{
        border:
          activeCell != cell.id
            ? ""
            : theme == "light"
            ? "1px solid #ec7424"
            : "1px solid #2196f3",
      }}
      key={cell.id}
      onClick={(e) => {
        e.preventDefault();
        setActiveCell(cell.id);
      }}
      onBlur={(e) => {
        e.preventDefault();
        setActiveCell(null);
      }}
    >
      <div className={styles.cellOutput}>
        <div
          className={
            activeCell === cell.id ? styles.cellActive : styles.cellInactive
          }
        ></div>
        <div className={styles.outputContainer}>
          <div className={styles.outputItem}>
            <div className={styles.outputIcon} />
          </div>
          <div className={styles.outputContent}>{cell.output}</div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownCell;
