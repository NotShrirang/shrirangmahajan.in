import React, { useState, useEffect, lazy, Suspense } from "react";
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

// Modern layout + Home stay eager — Home is the entry route and the layout
// renders on every navigation. Everything else loads on demand.
import ModernLayout from "./modern/components/Layout";
import Home from "./modern/pages/Home";

const Projects = lazy(() => import("./modern/pages/Projects"));
const Writing = lazy(() => import("./modern/pages/Writing"));
const Post = lazy(() => import("./modern/pages/Post"));
const Experience = lazy(() => import("./modern/pages/Experience"));
const Contact = lazy(() => import("./modern/pages/Contact"));
const TinyGPT = lazy(() => import("./modern/pages/TinyGPT"));

// Jupyter mode is legacy / alt-view. Every route below is lazy so a visitor
// who never opens /jupyter never downloads any of it.
const Chatbot = lazy(() => import("./components/Chatbot/Chatbot"));
const TitleBar = lazy(() => import("./components/TitleBar/TitleBar"));
const MenuBar = lazy(() => import("./components/MenuBar/MenuBar"));
const ControlBar = lazy(() => import("./components/ControlBar/ControlBar"));
const CellsPage = lazy(() => import("./pages/CellsPage/CellsPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage/ExperiencePage"));
const ProjectPage = lazy(() => import("./pages/ProjectsPage/ProjectPage"));
const BlogsPage = lazy(() => import("./pages/Blogs/BlogsPage"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const ContactPage = lazy(() => import("./pages/ContactPage/ContactPage"));

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
          <Suspense fallback={<div className="routeFallback" aria-hidden="true" />}>
            <Routes>
              <Route element={<ModernLayout />}>
                <Route index element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blogs" element={<Writing />} />
                <Route path="/blogs/:slug" element={<Post />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/tinygpt" element={<TinyGPT />} />
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
          </Suspense>
        </div>
      </BrowserRouter>
    </MyContext.Provider>
  );
}

export default App;
