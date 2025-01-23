import React, { useState, useEffect } from "react";
import TitleBar from "../../components/TitleBar/TitleBar";
import MenuBar from "../../components/MenuBar/MenuBar";
import styles from "./HomePage.module.css";
import ControlBar from "../../components/ControlBar/ControlBar";
import CellsPage from "../CellsPage/CellsPage";

const HomePage = () => {
  return (
    <div className={styles.homePageContainer}>
      <TitleBar />
      <MenuBar />
      <ControlBar />
      <CellsPage />
    </div>
  );
};

export default HomePage;
