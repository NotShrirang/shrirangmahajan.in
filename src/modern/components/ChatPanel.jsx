import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ChatPanel.module.css";

import { fetchChatCompletion } from "../../api/fetchModelInference";
import { fetchExperience } from "../../data/experiences";
import { projects } from "../../data/projects";
import skills from "../../data/skills";
import reactElementToString from "../../utils/reactElementToString";

const NAV_DELAY_MS = 1500;
const STORAGE_KEY = "sm-chat-history-v1";
// Cap the persisted history so a marathon chat doesn't outgrow sessionStorage.
const MAX_PERSISTED_MESSAGES = 80;

const PATH_LABELS = {
  "/": "Home",
  "/projects": "Projects",
  "/blogs": "Writing",
  "/experience": "Experience",
  "/contact": "Contact",
  "/tinygpt": "TinyGPT",
};

function loadStoredMessages() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function persistMessages(messages) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = messages.slice(-MAX_PERSISTED_MESSAGES);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    // Storage full / disabled — best-effort only.
  }
}

const SUGGESTIONS = [
  "Show me your projects",
  "Take me to the TinyGPT demo",
  "What did Shrirang do at Skylark Labs?",
  "How was TinyGPT pretrained on a single GPU?",
];

export default function ChatPanel() {
  const navigate = useNavigate();
  // Initialize from sessionStorage so the thread survives client-side
  // route changes and soft reloads. Closing the tab clears it.
  const [messages, setMessages] = useState(() => loadStoredMessages());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);
  const pendingNavRef = useRef(null);

  // Mirror to sessionStorage whenever the message list changes.
  useEffect(() => {
    persistMessages(messages);
  }, [messages]);

  const context = useMemo(() => {
    return `Shrirang Mahajan — site context

CONTACT & LOCATION
  email:     shrirangmahajan123@gmail.com
  location:  Pune, India  (IST, UTC+5:30)
  status:    Open to interesting work — best response on weekdays.

SOCIAL & ACCOUNTS  (use these when the user asks where to find Shrirang)
  GitHub:        https://github.com/NotShrirang
  LinkedIn:      https://www.linkedin.com/in/shrirang-mahajan
  X / Twitter:   https://x.com/notshrirang
  Hugging Face:  https://huggingface.co/NotShrirang
  Kaggle:        https://www.kaggle.com/notshrirang
  PyPI:          https://pypi.org/user/NotShrirang
  Resume (PDF):  https://drive.google.com/file/d/1gex06Ruc1n8Pwlihg14v8NdQj26uaSck/view
  TinyGPT (Streamlit demo): https://tinygpt.streamlit.app

PROJECTS

${projects
  .map(
    (p) =>
      `name: ${p.title}
description: ${reactElementToString(p.description)}`
  )
  .join("\n\n")}

SKILLS
${skills.map((s) => s.name).join(", ")}

EXPERIENCE

${fetchExperience()
  .map(
    (e) =>
      `Role: ${e.title}
Company: ${e.company}
Description: ${reactElementToString(e.description)}`
  )
  .join("\n\n")}
`;
  }, []);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    if (!text || loading) return;
    const userMsg = { id: Date.now(), sender: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = messages;
      const { text: replyText, actions } = await fetchChatCompletion({
        query: text,
        context,
        history,
      });
      const navAction = actions.find((a) => a.type === "navigate");
      const aiMsg = {
        id: Date.now() + 1,
        sender: "assistant",
        text: replyText || "Hmm, I couldn't put that together. Try rephrasing?",
        navTarget: navAction?.path || null,
      };
      setMessages((m) => [...m, aiMsg]);

      // Fire the redirect after a beat so the visitor can read what the
      // assistant said.
      if (navAction?.path) {
        clearTimeout(pendingNavRef.current);
        pendingNavRef.current = setTimeout(() => {
          navigate(navAction.path);
        }, NAV_DELAY_MS);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text: "Network hiccup. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (text) send(text);
  };

  const handleClear = () => {
    clearTimeout(pendingNavRef.current);
    setMessages([]);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* noop */
    }
  };

  return (
    <div className={styles.shell} aria-label="Ask me anything">
      <div className={styles.frame}>
        {messages.length > 0 && (() => {
          const userCount = messages.filter((m) => m.sender === "user").length;
          return (
          <div className={styles.frameHeader}>
            <span className={styles.frameHeaderMeta}>
              {userCount} message{userCount === 1 ? "" : "s"}
              <span className={styles.frameHeaderSep}>·</span>
              <span>kept until you close this tab</span>
            </span>
            <button
              type="button"
              className={styles.frameClearBtn}
              onClick={handleClear}
              aria-label="Clear chat"
            >
              Clear
            </button>
          </div>
          );
        })()}
        <div className={styles.transcript} ref={scrollerRef}>
          {messages.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyLine}>
                <em>I know this entire site.</em> Ask me about Shrirang's
                work, or pick a prompt below.
              </p>
              <div className={styles.suggestions}>
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={styles.suggestion}
                    onClick={() => send(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <article
              key={m.id}
              className={`${styles.msg} ${
                m.sender === "user" ? styles.msgUser : styles.msgAi
              }`}
            >
              <div className={styles.msgLabel}>
                {m.sender === "user" ? "You" : "Assistant"}
              </div>
              <div className={styles.msgBody}>
                {m.sender === "user" ? (
                  <p>{m.text}</p>
                ) : (
                  <Markdown remarkPlugins={[remarkGfm]}>{m.text}</Markdown>
                )}
                {m.navTarget && (
                  <div className={styles.navHint} aria-live="polite">
                    <span className={styles.navHintArr} aria-hidden="true">
                      →
                    </span>
                    <span>
                      Redirecting to{" "}
                      <strong>
                        {PATH_LABELS[m.navTarget] || m.navTarget}
                      </strong>
                      <span className={styles.navHintDots}>
                        <span />
                        <span />
                        <span />
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}

          {loading && (
            <article className={`${styles.msg} ${styles.msgAi}`}>
              <div className={styles.msgLabel}>Reply</div>
              <div className={styles.msgBody}>
                <div className={styles.typing} aria-label="Thinking">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </article>
          )}
        </div>

        <form className={styles.composer} onSubmit={handleSubmit}>
          <div className={styles.composerLabel}>›</div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className={styles.composerInput}
            aria-label="Your message"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={styles.composerSend}
            aria-label="Send"
          >
            <span>Send</span>
            <span aria-hidden="true">↵</span>
          </button>
        </form>
      </div>
    </div>
  );
}
