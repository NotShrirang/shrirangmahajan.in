import React, { useState, useEffect } from "react";

const Expander = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);

  return (
    <div
      style={{
        border: theme === "dark" ? "1px solid #f0f0f0" : "1px solid #333",
        borderRadius: "0.75rem",
      }}
    >
      <div
        style={{ paddingLeft: "1rem", display: "flex", alignItems: "center" }}
      >
        <h3>Explanation</h3>
        {expanded && (
          <div
            style={{
              marginLeft: "auto",
              marginRight: "1rem",
              color: theme === "dark" ? "white" : "black",
              cursor: "pointer",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read Less" : "Read More"}
          </div>
        )}
      </div>
      <div
        style={{
          position: "relative",
          height: expanded ? "auto" : "50px",
          overflow: "hidden",
          paddingBottom: expanded ? "50px" : "0",
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%",
            height: expanded ? "50px" : "50px",
            cursor: "pointer",
            border: "none",
            position: "absolute",
            bottom: "0",
            right: "0",
            background: `linear-gradient(to bottom, ${
              theme === "light" ? "#f0f0f0" : "#444"
            }, ${theme === "light" ? "#e0e0e0" : "#222"})`,
            opacity: "0.9",
            borderRadius: "0 0 1rem 1rem",
            color: theme === "dark" ? "white" : "black",
            zIndex: "100",
          }}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
        <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Expander;
