import React, { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import styles from "./TinyGPTCell.module.css";

const RUN_IDLE =
  "https://img.icons8.com/?size=100&id=59862&format=png&color=BDBDBD";
const RUN_BUSY =
  "https://img.icons8.com/?size=100&id=clUTZbeFfSbc&format=png&color=BDBDBD";
const RUN_DONE =
  "https://img.icons8.com/?size=100&id=91463&format=png&color=BDBDBD";

const DEFAULT_MAX_NEW_TOKENS = 80;
const DEFAULT_TEMPERATURE = 0.8;
const DEFAULT_TOP_K = 40;
const DEFAULT_PROMPT = "Write a haiku about transformers.";

const LIMITS = {
  maxNewTokens: { min: 1, max: 256, step: 1 },
  temperature: { min: 0.1, max: 2.0, step: 0.1 },
  topK: { min: 1, max: 200, step: 1 },
};

function clamp(n, { min, max }) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function NumInput({ value, onChange, limits, disabled, label, isFloat }) {
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = isFloat ? parseFloat(draft) : parseInt(draft, 10);
    const next = clamp(parsed, limits);
    onChange(next);
    setDraft(String(next));
  };

  return (
    <input
      type="number"
      className={styles.numInput}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
          e.target.blur();
        }
      }}
      min={limits.min}
      max={limits.max}
      step={limits.step}
      disabled={disabled}
      aria-label={label}
      style={{ width: `${Math.max(2, String(draft).length + 1)}ch` }}
    />
  );
}

export default function TinyGPTCell({ id, activeCell, setActiveCell }) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [maxNewTokens, setMaxNewTokens] = useState(DEFAULT_MAX_NEW_TOKENS);
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
  const [topK, setTopK] = useState(DEFAULT_TOP_K);
  const [phase, setPhase] = useState("idle"); // idle | loading | ready | generating | done | error
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [backend, setBackend] = useState(null);
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState(null); // { tokenCount, totalMs }
  const [error, setError] = useState(null);
  const [execCount, setExecCount] = useState(0);
  const modRef = useRef(null);
  const cellRef = useRef(null);
  const inputRef = useRef(null);

  const isBusy = phase === "loading" || phase === "generating";
  const iconSrc =
    phase === "loading" || phase === "generating"
      ? RUN_BUSY
      : phase === "done"
      ? RUN_DONE
      : RUN_IDLE;

  const ensureModule = useCallback(async () => {
    if (modRef.current) return modRef.current;
    modRef.current = await import(
      "../../modern/lib/tinygpt-inference.js"
    );
    return modRef.current;
  }, []);

  const run = useCallback(async () => {
    if (isBusy) return;
    const text = prompt.trim();
    if (!text) return;

    setError(null);
    setStats(null);
    setOutput("");

    let mod;
    try {
      mod = await ensureModule();
    } catch (e) {
      setError("Couldn't load inference engine.");
      setPhase("error");
      return;
    }

    // First run: download + initialize ONNX model.
    if (phase === "idle" || phase === "error") {
      setPhase("loading");
      setProgress({ loaded: 0, total: 0 });
      try {
        const { backend: be } = await mod.loadModel({
          onProgress: setProgress,
        });
        setBackend(be);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to load model.");
        setPhase("error");
        return;
      }
    }

    setPhase("generating");
    setExecCount((n) => (n === "*" ? 1 : n + 1));

    let acc = "";
    try {
      const wrapped = mod.formatInstructionPrompt(text);
      const result = await mod.generate({
        prompt: wrapped,
        maxNewTokens: clamp(maxNewTokens, LIMITS.maxNewTokens),
        temperature: clamp(temperature, LIMITS.temperature),
        topK: clamp(topK, LIMITS.topK),
        stopStrings: mod.DEFAULT_STOP_STRINGS,
        onToken: ({ text: chunk }) => {
          acc += chunk;
          flushSync(() => setOutput(acc));
        },
      });
      setStats({ tokenCount: result.tokenCount, totalMs: result.totalMs });
      setPhase("done");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Generation failed.");
      setPhase("error");
    }
  }, [prompt, phase, isBusy, ensureModule, maxNewTokens, temperature, topK]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
      run();
    }
  };

  // Frame the prompt as a Python string literal: prompt = "..."
  // The input itself is colored as a string token, surrounded by visible quotes.
  const progressPct =
    progress.total > 0
      ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
      : 0;

  const isActive = activeCell === id;

  return (
    <div
      className={styles.cell}
      ref={cellRef}
      id={id}
      tabIndex={0}
      style={{
        border: isActive
          ? "1px solid var(--cellActive, #2196f3)"
          : "1px solid transparent",
      }}
      onClick={() => setActiveCell && setActiveCell(id)}
      onBlur={() => setActiveCell && setActiveCell(null)}
    >
      <div className={styles.cellInput}>
        <div
          className={isActive ? styles.cellActive : styles.cellInactive}
        />
        <div className={styles.cellContent}>
          <div className={styles.cellControl}>
            <div className={styles.controlItem} onClick={run}>
              <img
                src={iconSrc}
                alt={isBusy ? "Running…" : "Run cell"}
                className={styles.controlIcon}
                data-disabled={isBusy ? "true" : "false"}
              />
            </div>
            <div className={styles.cellCount}>
              [{phase === "generating" || phase === "loading" ? "*" : execCount || ""}]
            </div>
          </div>
          <div className={styles.codeContainer}>
            <div className={styles.codeLine}>
              <span className={styles.kw}>from</span>{" "}
              <span className={styles.var}>tinygpt</span>{" "}
              <span className={styles.kw}>import</span>{" "}
              <span className={styles.fn}>TinyGPT</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.cm}>
                {"# 95M params · pretrained on OpenWebText · Alpaca-SFT"}
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.var}>model</span> ={" "}
              <span className={styles.fn}>TinyGPT</span>.
              <span className={styles.fn}>load</span>(
              <span className={styles.str}>"NotShrirang/TinyGPT"</span>)
            </div>
            <div className={styles.codeLine}>
              <span className={styles.var}>prompt</span> ={" "}
              <span className={styles.promptQuote}>"</span>
              <input
                ref={inputRef}
                type="text"
                className={styles.promptInput}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setActiveCell && setActiveCell(id)}
                spellCheck={false}
                aria-label="Prompt for TinyGPT"
                placeholder="ask anything…"
                disabled={isBusy}
                size={Math.max(8, prompt.length + 1)}
              />
              <span className={styles.promptQuote}>"</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.var}>output</span> ={" "}
              <span className={styles.var}>model</span>.
              <span className={styles.fn}>generate</span>(
              <span className={styles.var}>prompt</span>,{" "}
              <span className={styles.var}>max_new_tokens</span>=
              <NumInput
                value={maxNewTokens}
                onChange={setMaxNewTokens}
                limits={LIMITS.maxNewTokens}
                disabled={isBusy}
                label="max_new_tokens"
              />
              ,{" "}
              <span className={styles.var}>temperature</span>=
              <NumInput
                value={temperature}
                onChange={setTemperature}
                limits={LIMITS.temperature}
                disabled={isBusy}
                label="temperature"
                isFloat
              />
              ,{" "}
              <span className={styles.var}>top_k</span>=
              <NumInput
                value={topK}
                onChange={setTopK}
                limits={LIMITS.topK}
                disabled={isBusy}
                label="top_k"
              />
              )
            </div>
            <div className={styles.codeLine}>
              <span className={styles.fn}>print</span>(
              <span className={styles.var}>output</span>)
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cellOutput}>
        <div
          className={isActive ? styles.cellActive : styles.cellInactive}
        />
        <div className={styles.outputItem}>
          <div className={styles.outputIcon} />
        </div>
        <div
          className={styles.outputContent}
          style={{
            border: isActive
              ? "1px solid #4f4f4f"
              : "1px solid transparent",
          }}
        >
          {phase === "idle" && (
            <span className={styles.outputEmpty}>
              {"<press ▶ — first run downloads ~536 MB to your browser>"}
            </span>
          )}

          {phase === "loading" && (
            <>
              <div className={styles.outputStatus}>
                Downloading model · {progressPct}%
                {progress.total > 0 &&
                  ` · ${(progress.loaded / 1024 / 1024).toFixed(1)} / ${(
                    progress.total /
                    1024 /
                    1024
                  ).toFixed(1)} MB`}
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPct || 1}%` }}
                />
              </div>
            </>
          )}

          {(phase === "generating" || phase === "done") && (
            <>
              {backend && (
                <div className={styles.outputStatus}>
                  backend: {backend.toUpperCase()}
                </div>
              )}
              <div>
                {output}
                {phase === "generating" && (
                  <span className={styles.outputCursor} aria-hidden="true" />
                )}
              </div>
              {phase === "done" && stats && (
                <div className={styles.statsLine}>
                  {stats.tokenCount} tokens · {(stats.totalMs / 1000).toFixed(2)}s ·{" "}
                  {((stats.tokenCount / stats.totalMs) * 1000).toFixed(1)} tok/s
                </div>
              )}
            </>
          )}

          {phase === "error" && (
            <span className={styles.errorText}>
              {"<error>"} {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
