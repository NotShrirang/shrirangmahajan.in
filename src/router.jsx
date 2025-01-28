import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import CellsPage from "./pages/CellsPage/CellsPage";
import ExperiencePage from "./pages/ExperiencePage/ExperiencePage";
import ProjectPage from "./pages/ProjectsPage/ProjectPage";
import ContactPage from "./pages/ContactPage/ContactPage";

const router = createBrowserRouter([
  {
    index: true,
    element: <CellsPage />,
  },
  {
    path: "/experience/",
    element: <ExperiencePage />,
  },
  {
    path: "/projects/",
    element: <ProjectPage />,
  },
  {
    path: "/contact/",
    element: <ContactPage />,
  },
  {
    path: "",
    element: <Navigate to="/" />,
  },
]);

export default router;
