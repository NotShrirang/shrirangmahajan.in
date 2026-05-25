import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import "./App.css";
import "./modern/styles/fonts.css";
import "./modern/styles/tokens.css";
import "./modern/styles/base.css";

import MyContext from "./MyContext";
import Chatbot from "./components/Chatbot/Chatbot";

// Jupyter (legacy) chrome
import TitleBar from "./components/TitleBar/TitleBar";
import MenuBar from "./components/MenuBar/MenuBar";
import ControlBar from "./components/ControlBar/ControlBar";

// Existing pages — now mounted under /jupyter/*
import CellsPage from "./pages/CellsPage/CellsPage";
import ExperiencePage from "./pages/ExperiencePage/ExperiencePage";
import ProjectPage from "./pages/ProjectsPage/ProjectPage";
import BlogsPage from "./pages/Blogs/BlogsPage";
import Blog from "./pages/Blog/Blog";
import ContactPage from "./pages/ContactPage/ContactPage";

// Modern site
import ModernLayout from "./modern/components/Layout";
import Home from "./modern/pages/Home";
import Projects from "./modern/pages/Projects";
import Writing from "./modern/pages/Writing";
import Post from "./modern/pages/Post";
import Experience from "./modern/pages/Experience";
import Contact from "./modern/pages/Contact";

function ModeBodyClass() {
  const location = useLocation();
  useEffect(() => {
    const mode = location.pathname.startsWith("/jupyter") ? "jupyter" : "modern";
    document.body.dataset.mode = mode;
  }, [location.pathname]);
  return null;
}

function ChatbotOnJupyterOnly() {
  const location = useLocation();
  if (!location.pathname.startsWith("/jupyter")) return null;
  return <Chatbot />;
}

function JupyterLayout() {
  return (
    <div className="jupyterShell">
      <TitleBar />
      <MenuBar />
      <ControlBar />
      <Outlet />
    </div>
  );
}

function App() {
  const [cellExecutionCount, setCellExecutionCount] = useState(0);
  const [cellExecuted, setCellExecuted] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [page, setPage] = useState("home");

  return (
    <MyContext.Provider
      value={{
        cellExecutionCount,
        setCellExecutionCount,
        cellExecuted,
        setCellExecuted,
        executing,
        setExecuting,
        page,
        setPage,
      }}
    >
      <BrowserRouter>
        <ModeBodyClass />
        <div className="appContainer">
          <Routes>
            <Route element={<ModernLayout />}>
              <Route index element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blogs" element={<Writing />} />
              <Route path="/blogs/:slug" element={<Post />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            <Route path="/jupyter" element={<JupyterLayout />}>
              <Route index element={<CellsPage />} />
              <Route path="experience" element={<ExperiencePage />} />
              <Route path="projects" element={<ProjectPage />} />
              <Route path="blogs" element={<BlogsPage />} />
              <Route path="blogs/:slug" element={<Blog />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>
          </Routes>
          <ChatbotOnJupyterOnly />
        </div>
      </BrowserRouter>
    </MyContext.Provider>
  );
}

export default App;
