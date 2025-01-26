import React, { useEffect } from "react";
import styles from "./ExperiencePage.module.css";

const ExperiencePage = () => {
  useEffect(() => {
    document.title = "Experience | Shrirang Mahajan";
  }, []);

  return (
    <div className={styles.ExperiencePage}>
      <div className={styles.ExperiencePageContainer}>
        <div className={styles.ExperiencePageContent}>
          <div className={styles.ExperiencePageTitle}>Experience</div>
          <div className={styles.ExperiencePageItemList}>
            <div className={styles.ExperiencePageItem}>Exp 1</div>
            <div className={styles.ExperiencePageItem}>Exp 2</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
