import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./Cell.module.css";
import MyContext from "../../MyContext";

const Cell = ({ cell, activeCell, setActiveCell }) => {
  const divRef = useRef(null);
  const [showOutput, setShowOutput] = useState(true);
  const [executionState, setExecutionState] = useState(0);
  const [localCellExecutionCount, setLocalCellExecutionCount] = useState(0);
  const {
    cellExecutionCount,
    setCellExecutionCount,
    cellExecuted,
    setCellExecuted,
    executing,
    setExecuting,
  } = useContext(MyContext);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
    setLocalCellExecutionCount(0);
  }, [theme]);

  const executeCell = (e) => {
    e.preventDefault();
    setExecuting(true);
    setShowOutput(false);
    setExecutionState(1);
    setLocalCellExecutionCount("*");
    setTimeout(() => {
      setExecutionState(2);
    }, 500);
    setTimeout(() => {
      setShowOutput(true);
      setExecutionState(0);
      const totalExecutions = cellExecutionCount + 1;
      setCellExecutionCount(totalExecutions);
      setLocalCellExecutionCount(totalExecutions);
      setCellExecuted(true);
      setExecuting(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      executeCell(e);
      setActiveCell(cell.id + 1);
      divRef.current.blur();
    }

    if (e.key === "Enter" && e.ctrlKey) {
      executeCell(e);
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
      {cell.id === activeCell ? divRef.current.focus() : null}
      <div className={styles.cellInput}>
        <div
          className={
            activeCell === cell.id ? styles.cellActive : styles.cellInactive
          }
        ></div>
        <div className={styles.cellContent}>
          <div className={styles.cellControl}>
            <div className={styles.controlItem} onClick={executeCell}>
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
            <div
              className={styles.cellCount}
              style={{
                color:
                  activeCell != cell.id
                    ? ""
                    : theme == "light"
                    ? "1px solid #ec7424"
                    : "1px solid #2196f3",
              }}
            >
              [{localCellExecutionCount != 0 ? localCellExecutionCount : ""}]
            </div>
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
      )}
    </div>
  );
};

export default Cell;
