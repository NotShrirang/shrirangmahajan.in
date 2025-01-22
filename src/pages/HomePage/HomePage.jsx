import React, { useState, useEffect } from "react";
import TitleBar from "../../components/TitleBar/TitleBar";
import MenuBar from "../../components/MenuBar/MenuBar";
import styles from "./HomePage.module.css";
import ControlBar from "../../components/ControlBar/ControlBar";

const HomePage = () => {
  return (
    <div className={styles.homePageContainer}>
      <TitleBar />
      <MenuBar />
      <ControlBar />
    </div>
  );
};

export default HomePage;
