import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MenuBar.module.css";

const MenuBar = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.menuBarContainer}>
      <div className={styles.menuBarContent}>
        <div className={styles.menuComponent}>
          <div
            className={styles.menuItemFirst}
            onClick={() => navigate("/jupyter")}
          >
            Home
          </div>
          <div
            className={styles.menuItem}
            onClick={() => navigate("/jupyter/experience")}
          >
            Experience
          </div>
          <div
            className={styles.menuItem}
            onClick={() => navigate("/jupyter/projects")}
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
            onClick={() => navigate("/jupyter/blogs")}
          >
            Blogs
          </div>
          <div
            className={styles.menuItem}
            onClick={() => navigate("/jupyter/contact")}
          >
            Contact
          </div>
        </div>
        <div className={styles.trustedContainer}>
          <div
            className={styles.trusted}
            onClick={() => navigate("/")}
            title="Exit Jupyter mode"
            style={{ cursor: "pointer" }}
          >
            ← Modern site
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
