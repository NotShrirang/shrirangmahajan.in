import React, { useState, useEffect } from "react";
import styles from "./MenuBar.module.css";

const MenuBar = () => {
  return (
    <div className={styles.menuBarContainer}>
      <div className={styles.menuBarContent}>
        <div className={styles.menuComponent}>
          <div className={styles.menuItem}>Projects</div>
          <div className={styles.menuItem}>Experience</div>
          <div className={styles.menuItem}>Education</div>
          <div className={styles.menuItem}>Contact</div>
        </div>
        <div className={styles.trustedContainer}>
          <div className={styles.trusted}>Trusted</div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
