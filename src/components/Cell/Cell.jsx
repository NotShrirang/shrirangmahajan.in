import React, { useState } from "react";
import styles from "./Cell.module.css";

const Cell = ({ cell, activeCell, setActiveCell }) => {
  const [showOutput, setShowOutput] = useState(true);
  const [executionState, setExecutionState] = useState(0);

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
          <div
            className={styles.controlItem}
            onClick={() => {
              setShowOutput(false);
              setExecutionState(1);
              setTimeout(() => {
                setExecutionState(2);
              }, 500);
              setTimeout(() => {
                setShowOutput(true);
                setExecutionState(0);
              }, 1000);
            }}
          >
            <img
              src={
                executionState === 0
                  ? "https://img.icons8.com/?size=100&id=59862&format=png&color=BDBDBD"
                  : executionState === 1
                  ? "https://img.icons8.com/?size=100&id=clUTZbeFfSbc&format=png&color=BDBDBD"
                  : "https://img.icons8.com/?size=100&id=91463&format=png&color=BDBDBD"
              }
              alt="Run this cell"
              className={styles.controlIcon}
            />
          </div>
          <div className={styles.codeContainer}>
            <pre className={styles.textarea}>{cell.content}</pre>
          </div>
        </div>
      </div>
      {showOutput && (
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
      )}
    </div>
  );
};

export default Cell;
