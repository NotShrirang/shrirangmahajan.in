import React, { useState, useEffect } from "react";
import styles from "./MenuBar.module.css";

const MenuBar = () => {
  return (
    <div className={styles.menuBarContainer}>
      <div className={styles.menuBarContent}>
        <div className={styles.menuComponent}>
          <div className={styles.menuItem}>
            <div>About</div>
          </div>
          <div className={styles.menuItem}>
            <div>Projects</div>
          </div>
          <div className={styles.menuItem}>
            <div>Experience</div>
          </div>
          <div className={styles.menuItem}>
            <div>Education</div>
          </div>
          <div className={styles.menuItem}>
            <div>Contact</div>
          </div>
        </div>
        <div className={styles.trustedContainer}>
          <div className={styles.trusted}>Trusted</div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
