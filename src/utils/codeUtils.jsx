import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const Code = ({ content, language, copy }) => {
  const [theme, setTheme] = React.useState("light");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);
  }, []);

  return (
    <div style={{ position: "relative", textWrap: "wrap" }}>
      <SyntaxHighlighter
        language={language}
        style={theme === "light" ? oneLight : vscDarkPlus}
        showLineNumbers
      >
        {content}
      </SyntaxHighlighter>
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
    </div>
  );
};

export default Code;
