import React, { useState, useEffect, useRef, useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ChatPanel.module.css";

import { fetchChatCompletion } from "../../api/fetchModelInference";
import { fetchExperience } from "../../data/experiences";
import { projects } from "../../data/projects";
import skills from "../../data/skills";
import reactElementToString from "../../utils/reactElementToString";

const SUGGESTIONS = [
  "What did you do at Skylark Labs?",
  "Tell me about Tensorax.",
  "How did you pretrain TinyGPT on a single GPU?",
  "What's your favorite CUDA optimization?",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);

  const context = useMemo(() => {
    return `Shrirang Mahajan's Work:

Projects:

${projects
  .map(
    (p) =>
      `name: ${p.title}
description: ${reactElementToString(p.description)}`
  )
  .join("\n\n")}

Skills: ${skills.map((s) => s.name).join(", ")}

Experience:

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
      const reply = await fetchChatCompletion({
        query: text,
        context,
        history,
      });
      const aiMsg = {
        id: Date.now() + 1,
        sender: "assistant",
        text: reply || "Hmm, I couldn't put that together. Try rephrasing?",
      };
      setMessages((m) => [...m, aiMsg]);
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

  return (
    <section className={styles.panel} aria-label="Ask me anything">
      <div className={styles.head}>
        <div className={styles.kicker}>
          <span className={styles.dot} aria-hidden="true" />
          Ask me anything
        </div>
        <h2 className={styles.heading}>
          A small <em>AI</em> trained on everything I've done.
        </h2>
        <p className={styles.sub}>
          Powered by a Groq-hosted model with my projects, skills, and
          experience as context. Ask about my work, my code, or anything else
          on this site.
        </p>
      </div>

      <div className={styles.frame}>
        <div className={styles.transcript} ref={scrollerRef}>
          {messages.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyLine}>
                <em>Hi there.</em> Try one of these — or ask your own.
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
                {m.sender === "user" ? "You" : "Reply"}
              </div>
              <div className={styles.msgBody}>
                {m.sender === "user" ? (
                  <p>{m.text}</p>
                ) : (
                  <Markdown remarkPlugins={[remarkGfm]}>{m.text}</Markdown>
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
    </section>
  );
}
