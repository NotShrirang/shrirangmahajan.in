import React, { useState, useEffect } from "react";
import styles from "./MenuBar.module.css";

const MenuBar = () => {
  return (
    <div className={styles.menuBarContainer}>
      <div className={styles.menuBarContent}>
        <div className={styles.menuComponent}>
          <a className={styles.menuItem} href="#projects">
            Projects
          </a>
          <a className={styles.menuItem} href="#experience">
            Experience
          </a>
          <a className={styles.menuItem} href="#education">
            Education
          </a>
          <a className={styles.menuItem} href="#contact">
            Contact
          </a>
        </div>
        <div className={styles.trustedContainer}>
          <div className={styles.trusted}>Trusted</div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
