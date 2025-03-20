import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import CellsPage from "./pages/CellsPage/CellsPage";
import ExperiencePage from "./pages/ExperiencePage/ExperiencePage";
import ProjectPage from "./pages/ProjectsPage/ProjectPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import BlogsPage from "./pages/Blogs/BlogsPage";
import Blog from "./pages/Blog/Blog";

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
    path: "/blogs/",
    element: <BlogsPage />,
  },
  {
    path: "/blogs/:slug",
    element: <Blog />,
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
