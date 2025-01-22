import React, { useState, useEffect } from "react";
import styles from "./TitleBar.module.css";

const TitleBar = () => {
  return (
    <div className={styles.titleBarContainer}>
      <div className={styles.titleBarContent}>
        <div className={styles.nameComponent}>
          <a
            href="https://www.linkedin.com/in/shrirang-mahajan"
            className={styles.profileImageContainer}
          >
            <img
              src="https://media.licdn.com/dms/image/v2/D4D03AQGhluRHwBQXXw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1731242504044?e=1743033600&v=beta&t=TSj3TNglXTV38DM8WcGXurBCMKs0ucVH0Ir1asTRebU"
              alt="Shrirang Mahajan"
              className={styles.profileImage}
            />
          </a>
          <div className={styles.name}>Shrirang Mahajan</div>
          <div className={styles.lastCheckpoint}>
            Last Checkpoint: 7 days ago
          </div>
        </div>
        <div className={styles.githubIconContainer}>
          <a
            href="https://github.com/NotShrirang"
            className={styles.githubIconLink}
          >
            <img
              src="https://img.icons8.com/?size=100&id=106564&format=png&color=ffffff"
              alt="Shrirang's GitHub"
              className={styles.githubIcon}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
