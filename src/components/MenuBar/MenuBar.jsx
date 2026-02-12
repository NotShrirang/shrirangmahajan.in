import React from "react";
import styles from "./MenuBar.module.css";
import router from "../../router";

const MenuBar = () => {
  return (
    <div className={styles.menuBarContainer}>
      <div className={styles.menuBarContent}>
        <div className={styles.menuComponent}>
          <div
            className={styles.menuItemFirst}
            onClick={() => {
              router.navigate("/");
            }}
          >
            Home
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              router.navigate("/experience/");
            }}
          >
            Experience
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              router.navigate("/projects/");
            }}
          >
            Projects
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              window.open(
                "https://drive.google.com/file/d/1gex06Ruc1n8Pwlihg14v8NdQj26uaSck/view",
                "_blank"
              );
            }}
          >
            Resume
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              router.navigate("/blogs/");
            }}
          >
            Blogs
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              router.navigate("/contact/");
            }}
          >
            Contact
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
