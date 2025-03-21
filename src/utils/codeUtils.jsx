import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const Code = ({ content, language, copy, expander }) => {
  const [theme, setTheme] = React.useState("light");
  const [copied, setCopied] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);

  return (
    <div style={{ position: "relative", textWrap: "wrap" }}>
      {expander && (
        <div
          style={{
            position: "relative",
            top: "0",
            cursor: "pointer",
            fontSize: "0.8rem",
            backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            textAlign: "center",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "<> Collapse" : "<> Expand"}
        </div>
      )}
      {expanded && expander && (
        <SyntaxHighlighter
          language={language}
          style={theme === "light" ? oneLight : vscDarkPlus}
          showLineNumbers
        >
          {content}
        </SyntaxHighlighter>
      )}
      {copy && (
        <button
          style={{ position: "absolute", right: "0", top: "0" }}
          onClick={() => {
            navigator.clipboard.writeText(content);
          }}
        >
          Copy
        </button>
      )}
      {!expander && (
        <SyntaxHighlighter
          language={language}
          style={theme === "light" ? oneLight : vscDarkPlus}
          showLineNumbers
        >
          {content}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default Code;
