import React, { useState, useEffect } from "react";
import TitleBar from "../../components/TitleBar/TitleBar";
import MenuBar from "../../components/MenuBar/MenuBar";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.homePageContainer}>
      <TitleBar />
      <MenuBar />
    </div>
  );
};

export default HomePage;
