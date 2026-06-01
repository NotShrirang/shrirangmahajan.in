import React, { useState, useEffect } from "react";

const Expander = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const t = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(t);
  }, []);

  // Site tokens used here: --ink (text), --paper (bg), --paper-deep (subtle
  // bg), --rule (hairline), --accent (burnt sienna). The component reads them
  // off `:root`, so it adapts whichever page it's rendered inside.
  const collapsedBg =
    "linear-gradient(to bottom, color-mix(in srgb, var(--paper) 0%, transparent), var(--paper-deep) 60%)";
  const expandedBg = "var(--paper-deep)";

  const bottomBarBase = {
    width: "100%",
    height: "60px",
    cursor: "pointer",
    position: "absolute",
    bottom: 0,
    left: 0,
    border: 0,
    borderTop: "1px solid var(--rule)",
    background: expanded ? expandedBg : collapsedBg,
    color: "var(--accent)",
    fontFamily: "var(--font-mono, ui-monospace)",
    fontSize: "0.72rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "color 180ms ease, background 180ms ease",
    padding: "0 1rem",
  };

  const onBottomEnter = (e) => {
    e.currentTarget.style.color = "var(--paper)";
    e.currentTarget.style.background = "var(--accent)";
  };
  const onBottomLeaveCollapsed = (e) => {
    e.currentTarget.style.color = "var(--accent)";
    e.currentTarget.style.background = collapsedBg;
  };
  const onBottomLeaveExpanded = (e) => {
    e.currentTarget.style.color = "var(--accent)";
    e.currentTarget.style.background = expandedBg;
  };

  const togglePill = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.4rem 0.95rem",
    fontFamily: "var(--font-mono, ui-monospace)",
    fontSize: "0.7rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--ink)",
    background: "transparent",
    border: "1px solid var(--rule)",
    borderRadius: "999px",
    cursor: "pointer",
    userSelect: "none",
    lineHeight: 1,
    transition:
      "color 180ms ease, background 180ms ease, border-color 180ms ease",
  };

  return (
    <div
      style={{
        border: "1px solid var(--rule)",
        borderRadius: "6px",
        background: "var(--paper)",
        margin: "1.6rem 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.6rem 1rem 0.6rem 1rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display, ui-serif)",
            fontWeight: 400,
            fontSize: "1.15rem",
            letterSpacing: "-0.015em",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Explanation
        </h3>
        {expanded && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setExpanded(false);
            }}
            style={togglePill}
          >
            <span>Read less</span>
            <span aria-hidden="true" style={{ transform: "rotate(180deg)", fontSize: "0.95rem", lineHeight: 1 }}>
              ⌄
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          position: "relative",
          height: expanded ? "auto" : "60px",
          overflow: "hidden",
          paddingBottom: expanded ? "0" : "0",
        }}
      >
        <div
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingBottom: expanded ? "1rem" : "60px",
          }}
        >
          {children}
        </div>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            style={bottomBarBase}
            onMouseEnter={onBottomEnter}
            onMouseLeave={onBottomLeaveCollapsed}
          >
            <span>Read more</span>
            <span aria-hidden="true" style={{ fontSize: "0.95rem", lineHeight: 1 }}>
              ⌄
            </span>
          </button>
        )}
      </div>
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          style={{ ...bottomBarBase, position: "static", height: "44px" }}
          onMouseEnter={onBottomEnter}
          onMouseLeave={onBottomLeaveExpanded}
        >
          <span>Read less</span>
          <span
            aria-hidden="true"
            style={{ fontSize: "0.95rem", lineHeight: 1, transform: "rotate(180deg)" }}
          >
            ⌄
          </span>
        </button>
      )}
    </div>
  );
};

export default Expander;
