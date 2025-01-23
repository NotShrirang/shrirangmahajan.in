import React, { useState } from "react";
import styles from "./MarkdownCell.module.css";

const MarkdownCell = ({ cell, activeCell, setActiveCell }) => {
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
