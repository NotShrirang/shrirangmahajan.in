import React, { useState, useEffect, useRef } from "react";
import styles from "./MarkdownCell.module.css";

const MarkdownCell = ({ cell, activeCell, setActiveCell }) => {
  const divRef = useRef(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      console.log(cell.id + 1);
      setActiveCell(cell.id + 1);
      divRef.current.blur();
    }
    e.preventDefault();
  };

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
      ref={divRef}
      tabIndex={0}
      id={cell.id}
      key={cell.id}
      onClick={(e) => {
        setActiveCell(cell.id);
        if (divRef.current) {
          divRef.current.focus();
        }
      }}
      onBlur={(e) => {
        setActiveCell(null);
        if (divRef.current) {
          divRef.current.blur();
        }
      }}
      onKeyDownCapture={handleKeyDown}
      onKeyDown={handleKeyDown}
    >
      {cell.id === activeCell
        ? divRef.current
          ? divRef.current.focus()
          : null
        : null}
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
          <div
            className={styles.outputContent}
            style={{
              border:
                activeCell === cell.id
                  ? "1px solid #4f4f4f"
                  : "1px solid transparent",
            }}
          >
            {cell.output}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownCell;
