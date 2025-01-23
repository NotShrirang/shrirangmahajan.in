import React, { useState } from "react";
import styles from "./Cell.module.css";

const Cell = ({ cell, activeCell, setActiveCell }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(cell.content);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={styles.cell}
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
      <div className={styles.cellInput}>
        <div
          className={
            activeCell === cell.id ? styles.cellActive : styles.cellInactive
          }
        ></div>
        <div className={styles.cellContent}>
          <div className={styles.controlItem}>
            <img
              src="https://img.icons8.com/?size=100&id=59862&format=png&color=BDBDBD"
              alt="Run this cell"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.codeContainer}>
            {isEditing ? (
              <textarea
                className={styles.textarea}
                value={content}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ) : (
              <div
                onDoubleClick={handleDoubleClick}
                className={styles.textarea}
              >
                {content}
              </div>
            )}
          </div>
        </div>
      </div>
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
          <div className={styles.outputContent}>Output</div>
        </div>
      </div>
    </div>
  );
};

export default Cell;
