import React, { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import styles from "./LiveDemo.module.css";

// A grab-bag of instructions across many topics — geography, cooking, science,
// creative writing, philosophy, casual advice, jokes, history, animals.
// Four are sampled uniformly each time the chat opens or is cleared, with the
// previous round excluded so consecutive picks never overlap.
const PROMPT_POOL = [
  // Geography & places
  "What's the capital of Australia?",
  "Describe Paris in three sentences.",
  "What's the largest desert in the world?",
  "What's the smallest country in the world?",
  "What's the most populous city in Japan?",
  "Name three rivers in South America.",
  "Where would you find the Northern Lights?",
  // Science
  "Explain photosynthesis to a five-year-old.",
  "Describe the Milky Way in two sentences.",
  "How does a refrigerator work?",
  "What are stars made of?",
  "Why is the sky blue?",
  "Explain how rainbows form.",
  "What's the difference between weather and climate?",
  "How do plants communicate?",
  "Why do leaves change color in autumn?",
  "What's an atom, in simple terms?",
  "How do whales sleep?",
  "Why do cats purr?",
  // Cooking & food
  "Suggest a quick recipe with eggs and tomatoes.",
  "How do you make scrambled eggs?",
  "What makes a good cup of tea?",
  "Suggest a snack made with peanut butter.",
  "Why is salt used in cooking?",
  "What are three popular dishes from Italy?",
  "Describe the taste of mango.",
  "How do you fold an omelette?",
  // Creative writing
  "Tell me a short story about a lighthouse keeper.",
  "Write a haiku about coffee.",
  "Write a limerick about a cat.",
  "Write a short poem about rain.",
  "Write a four-line poem about the sea.",
  "Write a haiku about thunderstorms.",
  "Write a two-sentence horror story.",
  "Write a poem about an old library.",
  "Write a bedtime story for a child.",
  "Tell me a story about a kind stranger.",
  "Write a short poem about the moon.",
  // Self-help & habits
  "Give me three tips for learning a new language.",
  "What's the best way to start a new habit?",
  "Give me three reasons to take up running.",
  "Give me three tips for better sleep.",
  "How would you cheer up a sad friend?",
  "What does it mean to be brave?",
  "What are three benefits of journaling?",
  // Pop culture & advice
  "Recommend a book about space exploration.",
  "Suggest three hobbies for someone who likes the outdoors.",
  "Suggest a board game for four players.",
  "Suggest a song to start the morning.",
  "What's a good gift for a friend who loves books?",
  "What's a good icebreaker question?",
  // Fun facts & jokes
  "Tell me a fun fact about octopuses.",
  "Tell me a joke about programmers.",
  "Tell me a joke about doctors.",
  "What's a small thing that brings you joy?",
  // Everyday
  "Describe a perfect Sunday morning.",
  "Describe autumn in one sentence.",
  "Describe sunrise in one sentence.",
  "Describe the ocean in one sentence.",
  "Tell me about your favorite season.",
  // Definitions & language
  "What does the word 'serendipity' mean?",
  "What's the difference between an alligator and a crocodile?",
  "What's a good way to remember someone's name?",
  // History
  "Tell me about the invention of the printing press.",
  "Who built the pyramids of Giza, and when?",
  // Misc
  "What makes a good friend?",
  "What are three uses for baking soda?",
  "Suggest three uses for an empty jar.",
  "How do you make a paper airplane?",
  "What makes a good photograph?",
];

// Fisher–Yates shuffle. Array.sort with a random comparator isn't uniform.
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick `n` prompts, excluding anything in `recent` so successive picks
// never overlap. If `recent` covers most of the pool, gracefully fall back.
function pickPrompts(pool, n = 4, recent = []) {
  const recentSet = new Set(recent);
  const fresh = pool.filter((p) => !recentSet.has(p));
  const candidates = fresh.length >= n ? fresh : pool;
  return shuffle(candidates).slice(0, n);
}

// Generate until EOS or context limit — TinyGPT2's block size is 512.
const MAX_NEW_TOKENS = 512;
const TEMPERATURE = 0.8;
const TOP_K = 40;

export default function LiveDemo() {
  const [phase, setPhase] = useState("idle"); // idle | loading | ready | generating | error
  const [backend, setBackend] = useState(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [error, setError] = useState(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // [{ id, role, text, streaming?, tokens?, ms?, tps? }]
  const [prompts, setPrompts] = useState(() => pickPrompts(PROMPT_POOL));
  // Remember the last couple of rounds of suggestions so a fresh draw
  // doesn't surface the same questions immediately.
  const recentPromptsRef = useRef([]);
  // Mirror of `messages` for use inside async closures — avoids reading
  // stale state when the user submits a follow-up via suggestion chip.
  const messagesRef = useRef([]);
  const abortRef = useRef(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    recentPromptsRef.current = prompts;
  }, [prompts]);

  const [capabilities, setCapabilities] = useState({ checked: false });
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hasWebGPU =
        typeof navigator !== "undefined" && !!navigator.gpu;
      let webgpuAdapter = false;
      if (hasWebGPU) {
        try {
          const a = await navigator.gpu.requestAdapter();
          webgpuAdapter = !!a;
        } catch (e) {
          webgpuAdapter = false;
        }
      }
      if (!cancelled) {
        setCapabilities({
          checked: true,
          webgpu: webgpuAdapter,
          hardwareConcurrency:
            (typeof navigator !== "undefined" &&
              navigator.hardwareConcurrency) ||
            null,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll the transcript when content lands.
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, phase]);

  const handleLoad = useCallback(async () => {
    setPhase("loading");
    setError(null);
    setProgress({ loaded: 0, total: 0 });
    try {
      const mod = await import("../lib/tinygpt-inference.js");
      const { backend } = await mod.loadModel({ onProgress: setProgress });
      setBackend(backend);
      setPhase("ready");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load model.");
      setPhase("error");
    }
  }, []);

  const handleGenerate = useCallback(
    async (overrideInput) => {
      const text = (overrideInput ?? input).trim();
      if (!text || phase === "generating") return;

      // Snapshot turn into the message history.
      const userMsg = {
        id: Date.now(),
        role: "user",
        text,
      };
      const modelMsg = {
        id: Date.now() + 1,
        role: "model",
        text: "",
        streaming: true,
      };
      flushSync(() => {
        setMessages((prev) => [...prev, userMsg, modelMsg]);
        setInput("");
        setPhase("generating");
      });

      abortRef.current = false;

      let accumulated = "";
      let mod;
      try {
        mod = await import("../lib/tinygpt-inference.js");
      } catch (e) {
        setError("Failed to load inference engine.");
        setPhase("error");
        return;
      }

      try {
        // Build a multi-turn chat prompt from the prior conversation so the
        // model remembers what was just asked. Read from the ref to dodge
        // stale-closure issues with chained generations from suggestion chips.
        // Only include completed (non-streaming, non-errored) replies, and
        // exclude the user/model placeholders we just pushed.
        const history = messagesRef.current
          .filter(
            (m) =>
              m.id !== userMsg.id &&
              m.id !== modelMsg.id &&
              m.text &&
              !m.streaming &&
              !m.errored
          )
          .map((m) => ({ role: m.role, text: m.text }));

        const { prompt: wrapped, droppedTurns } = mod.fitChatPromptToBudget(
          history,
          text
        );
        if (droppedTurns > 0) {
          console.info(
            `[tinygpt] dropped ${droppedTurns} oldest turn${
              droppedTurns === 1 ? "" : "s"
            } to fit the 512-token context.`
          );
        }

        const result = await mod.generate({
          prompt: wrapped,
          maxNewTokens: MAX_NEW_TOKENS,
          temperature: TEMPERATURE,
          topK: TOP_K,
          stopStrings: mod.DEFAULT_STOP_STRINGS,
          onToken: ({ text: chunk }) => {
            accumulated += chunk;
            flushSync(() => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === modelMsg.id ? { ...m, text: accumulated } : m
                )
              );
            });
          },
          abortSignal: () => abortRef.current,
        });

        flushSync(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === modelMsg.id
                ? {
                    ...m,
                    text: accumulated,
                    streaming: false,
                    tokens: result.tokenCount,
                    ms: result.totalMs,
                    tps: result.tokensPerSec,
                  }
                : m
            )
          );
        });
      } catch (e) {
        console.error(e);
        flushSync(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === modelMsg.id
                ? { ...m, text: accumulated, streaming: false, errored: true }
                : m
            )
          );
        });
        setError(e?.message || "Generation failed.");
      }

      setPhase("ready");
    },
    [input, phase]
  );

  const handleStop = () => {
    abortRef.current = true;
  };

  const handleClear = () => {
    setMessages([]);
    setPrompts(pickPrompts(PROMPT_POOL, 4, recentPromptsRef.current));
  };

  const handleKeyDown = (e) => {
    // Enter submits, Shift+Enter inserts newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (phase !== "generating") handleGenerate();
    }
  };

  /* ──────── Render helpers ──────── */

  const percent =
    progress.total > 0 ? (progress.loaded / progress.total) * 100 : 0;

  return (
    <div className={styles.shell} aria-label="Live TinyGPT demo">
      <p className={styles.caveat}>
        <span className={styles.caveatLabel}>A note —</span> at 95M
        parameters, TinyGPT speaks English fluently but{" "}
        <em>isn't reliable on facts.</em> It will write a coherent sentence
        about anything, and confidently make things up. Treat it as a
        coherence demo, not a knowledge model.
      </p>

      <div className={styles.frame}>
        {/* ── IDLE — pre-load CTA ── */}
        {phase === "idle" && (
          <div className={styles.idle}>
            <div className={styles.idleStats}>
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Inference</div>
                <div className={styles.statValue}>
                  {capabilities.checked
                    ? capabilities.webgpu
                      ? "WebGPU"
                      : "WASM (CPU)"
                    : "Detecting…"}
                </div>
                <div className={styles.statSub}>
                  {capabilities.checked
                    ? capabilities.webgpu
                      ? "GPU-accelerated"
                      : `${capabilities.hardwareConcurrency || 2} CPU threads`
                    : ""}
                </div>
              </div>
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Privacy</div>
                <div className={styles.statValue}>Local only</div>
                <div className={styles.statSub}>nothing leaves your device</div>
              </div>
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Source</div>
                <div className={styles.statValue}>
                  <a
                    href="https://huggingface.co/NotShrirang/tinygpt"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.statLink}
                  >
                    HuggingFace ›
                  </a>
                </div>
                <div className={styles.statSub}>weights live on HF</div>
              </div>
            </div>

            <div className={styles.idleCtaRow}>
              <button
                type="button"
                className={styles.loadCta}
                onClick={handleLoad}
              >
                <span className={styles.loadCtaIcon} aria-hidden="true">
                  ▶
                </span>
                <span className={styles.loadCtaLabel}>Load TinyGPT</span>
                <span className={styles.loadCtaSize}>536 MB</span>
              </button>
              <p className={styles.idleHint}>
                <span aria-hidden="true">↑</span>{" "}
                Click to download the model and run it locally.
              </p>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className={styles.loading}>
            <div className={styles.loadingLabel}>
              <span className={styles.spinner} aria-hidden="true" />
              Downloading model
            </div>
            <div className={styles.progressBarOuter}>
              <div
                className={styles.progressBarInner}
                style={{ width: `${percent.toFixed(1)}%` }}
              />
            </div>
            <div className={styles.progressMeta}>
              <span>{percent.toFixed(0)}%</span>
            </div>
            <p className={styles.fine}>
              First load only. Browser cache will keep it for next time.
            </p>
          </div>
        )}

        {/* ── CHAT ── */}
        {(phase === "ready" || phase === "generating") && (
          <div className={styles.chat}>
            <div className={styles.chatBar}>
              <span className={styles.chatBarDot} />
              <span className={styles.chatBarLabel}>
                {phase === "generating" ? "Generating" : "Ready"}
              </span>
              <span className={styles.chatBarSep}>·</span>
              <span>{backend === "webgpu" ? "WebGPU" : "WASM"}</span>
              {messages.length > 0 && phase !== "generating" && (
                <button
                  type="button"
                  className={styles.chatBarClear}
                  onClick={handleClear}
                >
                  Clear chat
                </button>
              )}
            </div>

            <div className={styles.transcript} ref={scrollerRef}>
              {messages.length === 0 && (
                <div className={styles.empty}>
                  <p className={styles.emptyLine}>
                    <em>Ask anything. Fluent answers, often wrong facts —
                    that's the trade-off at 95M parameters.</em>
                  </p>
                  <div className={styles.suggestions}>
                    {prompts.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={styles.suggestion}
                        onClick={() => handleGenerate(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <article
                  key={m.id}
                  className={`${styles.msg} ${
                    m.role === "user" ? styles.msgUser : styles.msgModel
                  }`}
                >
                  <div className={styles.msgLabel}>
                    {m.role === "user" ? "You" : "TinyGPT"}
                  </div>
                  <div className={styles.msgBody}>
                    {m.text}
                    {m.streaming && (
                      <span className={styles.caret} aria-hidden="true" />
                    )}
                  </div>
                  {m.role === "model" && !m.streaming && m.tokens && (
                    <div className={styles.msgMeta}>
                      {m.tokens} tok · {(m.ms / 1000).toFixed(2)}s ·{" "}
                      {m.tps.toFixed(1)} tok/s
                    </div>
                  )}
                </article>
              ))}
            </div>

            <form
              className={styles.composer}
              onSubmit={(e) => {
                e.preventDefault();
                if (phase !== "generating") handleGenerate();
              }}
            >
              <textarea
                className={styles.composerInput}
                placeholder="Ask TinyGPT a question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={phase === "generating"}
                rows={2}
              />
              {phase === "generating" ? (
                <button
                  type="button"
                  className={styles.composerStop}
                  onClick={handleStop}
                  aria-label="Stop generation"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  className={styles.composerSend}
                  disabled={!input.trim()}
                  aria-label="Send"
                >
                  <span>Send</span>
                  <span aria-hidden="true">↵</span>
                </button>
              )}
            </form>
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === "error" && (
          <div className={styles.errorState}>
            <div className={styles.errorLabel}>Something went wrong</div>
            <p className={styles.errorMsg}>{error}</p>
            <button
              type="button"
              className={styles.composerSend}
              onClick={() => {
                setPhase(messages.length > 0 ? "ready" : "idle");
                setError(null);
              }}
            >
              <span>Try again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
