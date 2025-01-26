import React, { useState, useEffect, useContext } from "react";
import { RouterProvider } from "react-router-dom";
import MyContext from "../../MyContext";
import router from "../../router";
import TitleBar from "../../components/TitleBar/TitleBar";
import MenuBar from "../../components/MenuBar/MenuBar";
import styles from "./HomePage.module.css";
import ControlBar from "../../components/ControlBar/ControlBar";
import CellsPage from "../CellsPage/CellsPage";
import ProjectsPage from "../ProjectsPage/ProjectPage";

const HomePage = () => {
  return (
    <div className={styles.homePageContainer}>
      <TitleBar />
      <MenuBar />
      <ControlBar />
      <RouterProvider router={router} />
    </div>
  );
};

export default HomePage;
