import React, { useEffect, useRef, useState } from "react";
import Code from "../../../utils/codeUtils.jsx";
import BaseBlog from "../BaseBlog.js";
import cover from "../../../assets/images/blogs/InferenceFromScratch/cover.png";

/* ───────────────────────── theme ───────────────────────── */

const tint = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

// Modern view is always the cream paper theme; Jupyter view follows the OS scheme.
const VIZ_CSS = `
.ifs-viz {
  --viz-card: #f6f8fa;
  --viz-surface: #ffffff;
  --viz-border: #d0d7de;
  --viz-border-strong: #8c959f;
  --viz-grid: #e6eaef;
  --viz-text: #1f2328;
  --viz-muted: #57606a;
  --viz-faint: #6e7781;
  --viz-blue: #0969da;
  --viz-orange: #bc4c00;
  --viz-purple: #8250df;
  --viz-green: #1a7f37;
  --viz-red: #cf222e;
  --viz-on-accent: #ffffff;
  --viz-blue-soft: color-mix(in srgb, var(--viz-blue) 14%, transparent);
  --viz-green-soft: color-mix(in srgb, var(--viz-green) 14%, transparent);
}
body[data-mode="modern"] .ifs-viz {
  --viz-card: var(--paper-deep, #e8dfca);
  --viz-surface: var(--paper, #f1ebde);
  --viz-border: var(--rule, #cdc2a8);
  --viz-border-strong: var(--rule-strong, #8d8367);
  --viz-grid: var(--rule-soft, #ddd2b8);
  --viz-text: var(--ink, #1a1714);
  --viz-muted: var(--ink-soft, #3a342c);
  --viz-faint: var(--ink-mute, #635a4c);
  --viz-blue: #1f5c99;
  --viz-orange: var(--accent, #a44616);
  --viz-purple: #6f3fa8;
  --viz-green: #2e6b30;
  --viz-red: #b3261e;
  --viz-on-accent: var(--paper, #f1ebde);
}
@media (prefers-color-scheme: dark) {
  body:not([data-mode="modern"]) .ifs-viz {
    --viz-card: #262626;
    --viz-surface: #1e1e1e;
    --viz-border: #444c56;
    --viz-border-strong: #636e7b;
    --viz-grid: #343434;
    --viz-text: #e6edf3;
    --viz-muted: #adbac7;
    --viz-faint: #8b949e;
    --viz-blue: #58a6ff;
    --viz-orange: #f78166;
    --viz-purple: #d2a8ff;
    --viz-green: #3fb950;
    --viz-red: #f85149;
    --viz-on-accent: #0d1117;
  }
}
.ifs-viz svg text { font-family: var(--font-mono, ui-monospace, monospace); }
`;

/* ───────────────────────── shared styles ───────────────────────── */

const chartCard = {
  background: "var(--viz-card)",
  border: "1px solid var(--viz-border)",
  borderRadius: 10,
  padding: "1.2em 1.4em",
  margin: "1.8em 0",
  overflowX: "auto",
};

const captionStyle = {
  textAlign: "center",
  fontSize: "0.85em",
  color: "var(--viz-muted)",
  marginTop: "0.6em",
};

/* ───────────────────────── AnimatedDiagram ───────────────────────── */

function AnimatedDiagram({ children, caption, height = 220 }) {
  return (
    <div style={chartCard}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      {caption && <p style={captionStyle}>{caption}</p>}
    </div>
  );
}

/* ───────────────────────── BaselineAnimation ───────────────────────── */

function BaselineAnimation() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 6), 1200);
    return () => clearInterval(id);
  }, []);

  const tokens = ["The", "capital", "of", "France", "is", "Paris"];
  const processed = tokens.slice(0, step + 1);

  return (
    <AnimatedDiagram
      caption="Baseline: the model reprocesses the entire sequence for each new token"
      height={180}
    >
      <svg viewBox="0 0 700 160" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--viz-orange)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--viz-orange)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Reprocess highlight */}
        <rect
          x={20}
          y={30}
          width={Math.min(processed.length * 100, 600)}
          height={45}
          rx={6}
          fill="url(#baseGrad)"
          stroke="var(--viz-orange)"
          strokeWidth={1}
          strokeDasharray="4 3"
        >
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Tokens */}
        {processed.map((t, i) => (
          <g key={i}>
            <rect
              x={25 + i * 100}
              y={35}
              width={85}
              height={35}
              rx={5}
              fill={i === step ? "var(--viz-green)" : "var(--viz-border)"}
              stroke={i === step ? "var(--viz-green)" : "var(--viz-border-strong)"}
              strokeWidth={1.5}
            />
            <text
              x={25 + i * 100 + 42}
              y={58}
              textAnchor="middle"
              fill={i === step ? "var(--viz-on-accent)" : "var(--viz-text)"}
              fontSize={14}
              fontFamily="monospace"
              fontWeight={i === step ? 700 : 400}
            >
              {t}
            </text>
          </g>
        ))}

        {/* Arrow pointing to model */}
        <text x={350} y={105} textAnchor="middle" fill="var(--viz-muted)" fontSize={12} fontFamily="monospace">
          ↓ entire sequence fed to model each step
        </text>

        {/* Step counter */}
        <text x={350} y={145} textAnchor="middle" fill="var(--viz-faint)" fontSize={13} fontFamily="monospace">
          Step {step + 1}: processing {processed.length} token{processed.length > 1 ? "s" : ""} to generate token {step + 2}
        </text>
      </svg>
    </AnimatedDiagram>
  );
}

/* ───────────────────────── KVCacheAnimation ───────────────────────── */

function KVCacheAnimation() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 6), 1400);
    return () => clearInterval(id);
  }, []);

  const tokens = ["The", "capital", "of", "France", "is", "Paris"];

  return (
    <AnimatedDiagram
      caption="KV Cache: cached tokens (blue) are skipped — only the new token (green) is processed"
      height={200}
    >
      <svg viewBox="0 0 700 180" style={{ width: "100%", height: "100%" }}>
        {/* Cache row */}
        <text x={25} y={22} fill="var(--viz-muted)" fontSize={11} fontFamily="monospace">
          KV Cache
        </text>
        {tokens.slice(0, step).map((t, i) => (
          <g key={"c" + i}>
            <rect
              x={25 + i * 95}
              y={30}
              width={82}
              height={32}
              rx={5}
              fill="var(--viz-blue-soft)"
              stroke="var(--viz-blue)"
              strokeWidth={1}
            />
            <text
              x={25 + i * 95 + 41}
              y={51}
              textAnchor="middle"
              fill="var(--viz-blue)"
              fontSize={13}
              fontFamily="monospace"
            >
              {t}
            </text>
          </g>
        ))}

        {/* New token */}
        <text x={25} y={92} fill="var(--viz-muted)" fontSize={11} fontFamily="monospace">
          New input
        </text>
        <rect
          x={25}
          y={100}
          width={82}
          height={32}
          rx={5}
          fill="var(--viz-green-soft)"
          stroke="var(--viz-green)"
          strokeWidth={2}
        >
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </rect>
        <text
          x={66}
          y={121}
          textAnchor="middle"
          fill="var(--viz-green)"
          fontSize={13}
          fontFamily="monospace"
          fontWeight={700}
        >
          {tokens[step]}
        </text>

        {/* Arrow */}
        <line x1={130} y1={116} x2={180} y2={116} stroke="var(--viz-border-strong)" strokeWidth={1} markerEnd="url(#arrowGreen)" />
        <defs>
          <marker id="arrowGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={6} markerHeight={6} orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--viz-green)" />
          </marker>
        </defs>
        <text x={190} y={121} fill="var(--viz-green)" fontSize={12} fontFamily="monospace">
          → model processes only this token
        </text>

        {/* Step counter */}
        <text x={350} y={170} textAnchor="middle" fill="var(--viz-faint)" fontSize={13} fontFamily="monospace">
          Step {step + 1}: 1 token processed (vs {step + 1} without cache)
        </text>
      </svg>
    </AnimatedDiagram>
  );
}

/* ───────────────────────── BatchingAnimation ───────────────────────── */

function BatchingAnimation() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 1600);
    return () => clearInterval(id);
  }, []);

  const reqs = [
    { label: "Req 1", tokens: ["What", "is", "ML", "?"] },
    { label: "Req 2", tokens: ["How", "does", "AI", "work"] },
    { label: "Req 3", tokens: ["Tell", "me", "about", "GPT"] },
  ];
  const colors = ["var(--viz-blue)", "var(--viz-orange)", "var(--viz-purple)"];

  return (
    <AnimatedDiagram
      caption="Static batching: all requests processed in a single forward pass — GPU reads weights once"
      height={200}
    >
      <svg viewBox="0 0 700 180" style={{ width: "100%", height: "100%" }}>
        {/* Requests stacked */}
        {reqs.map((r, ri) => (
          <g key={ri}>
            <text
              x={15}
              y={28 + ri * 50}
              fill={colors[ri]}
              fontSize={11}
              fontFamily="monospace"
            >
              {r.label}
            </text>
            {r.tokens.map((t, ti) => (
              <rect
                key={ti}
                x={80 + ti * 75}
                y={15 + ri * 50}
                width={68}
                height={30}
                rx={4}
                fill={ti <= step ? tint(colors[ri], 19) : "var(--viz-surface)"}
                stroke={ti <= step ? colors[ri] : "var(--viz-border)"}
                strokeWidth={ti === step ? 2 : 1}
              />
            ))}
            {/* New generated token */}
            {step >= 0 && (
              <rect
                x={80 + 4 * 75}
                y={15 + ri * 50}
                width={68}
                height={30}
                rx={4}
                fill={tint(colors[ri], 13)}
                stroke={colors[ri]}
                strokeWidth={2}
                strokeDasharray="4 3"
              >
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </rect>
            )}
          </g>
        ))}

        {/* GPU box */}
        <rect
          x={490}
          y={25}
          width={180}
          height={120}
          rx={8}
          fill="var(--viz-surface)"
          stroke="var(--viz-border)"
          strokeWidth={1.5}
        />
        <text x={580} y={55} textAnchor="middle" fill="var(--viz-muted)" fontSize={12} fontFamily="monospace">
          GPU Forward Pass
        </text>
        <text x={580} y={80} textAnchor="middle" fill="var(--viz-green)" fontSize={16} fontFamily="monospace" fontWeight={700}>
          1 pass = 3 tokens
        </text>
        <text x={580} y={105} textAnchor="middle" fill="var(--viz-faint)" fontSize={11} fontFamily="monospace">
          weights read once
        </text>
        <text x={580} y={125} textAnchor="middle" fill="var(--viz-faint)" fontSize={11} fontFamily="monospace">
          step {step + 1} / 4
        </text>
      </svg>
    </AnimatedDiagram>
  );
}

/* ───────────────────────── ContinuousBatchingAnimation ───────────────────────── */

function ContinuousBatchingAnimation() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 14), 900);
    return () => clearInterval(id);
  }, []);

  // Req1: joins tick 0, prefill 3, decodes ticks 1-5 (5 tokens), done after tick 5
  // Req2: joins tick 1, prefill 2, decodes ticks 2-6 (5 tokens), done after tick 6
  // Req3: joins tick 2, prefill 4, decodes ticks 3-7 (5 tokens), done after tick 7
  // Req4: joins tick 3, prefill 2, decodes ticks 4-8 (5 tokens), done after tick 8
  // At ticks 4-5, all 4 requests decode simultaneously
  const reqs = [
    { id: 1, color: "var(--viz-blue)", joinTick: 0, prefillLen: 3, decodeLen: 5 },
    { id: 2, color: "var(--viz-orange)", joinTick: 1, prefillLen: 2, decodeLen: 5 },
    { id: 3, color: "var(--viz-purple)", joinTick: 2, prefillLen: 4, decodeLen: 5 },
    { id: 4, color: "var(--viz-green)", joinTick: 3, prefillLen: 2, decodeLen: 5 },
  ];

  const colW = 44;
  const rowH = 40;
  const rightEdge = 620;
  const gridY = 30;

  const rows = [];
  let event = null;

  for (const r of reqs) {
    if (tick < r.joinTick) continue;
    const firstDecodeTick = r.joinTick + 1;
    const lastDecodeTick = r.joinTick + r.decodeLen;
    if (tick > lastDecodeTick + 1) continue;
    if (tick === lastDecodeTick + 1) {
      event = `Req ${r.id} done → cache evicted, slot freed`;
      continue;
    }

    const isPrefilling = tick === r.joinTick;
    const decodesDone = isPrefilling ? 0 : Math.min(tick - r.joinTick, r.decodeLen);
    const totalTokens = r.prefillLen + decodesDone;

    if (isPrefilling) event = `Req ${r.id} joining → prefill ${r.prefillLen} prompt tokens`;

    rows.push({ ...r, isPrefilling, decodesDone, totalTokens });
  }

  // The rightmost column is the current forward-pass output for all active requests
  // Right-align: the last token of every row sits at the same x
  const currentColX = rightEdge - colW;

  return (
    <AnimatedDiagram
      caption="Continuous batching: the rightmost column is the current forward pass — all active requests decode there simultaneously"
      height={260}
    >
      <svg viewBox="0 0 700 240" style={{ width: "100%", height: "100%" }}>
        {/* Vertical line through the shared decode column */}
        {rows.some((r) => !r.isPrefilling) && (
          <g>
            <rect
              x={currentColX - 1}
              y={gridY - 4}
              width={colW + 2}
              height={rows.length * rowH + 8}
              rx={5}
              fill={tint("var(--viz-green)", 6)}
              stroke="var(--viz-green)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
            >
              <animate attributeName="opacity" values="0.5;1;0.5" dur="0.9s" repeatCount="indefinite" />
            </rect>
            <text
              x={currentColX + colW / 2}
              y={gridY - 10}
              textAnchor="middle"
              fill="var(--viz-green)"
              fontSize={10}
              fontFamily="monospace"
              fontWeight={600}
            >
              ▼ shared forward pass
            </text>
          </g>
        )}

        {/* Rows — right-aligned so last token is always at currentColX */}
        {rows.map((r, ri) => {
          const y = gridY + ri * rowH;
          const startX = currentColX - (r.totalTokens - 1) * colW;

          return (
            <g key={r.id}>
              {/* Label */}
              <text
                x={Math.min(startX, 90) - 8}
                y={y + 22}
                textAnchor="end"
                fill={r.color}
                fontSize={12}
                fontFamily="monospace"
                fontWeight={600}
              >
                Req {r.id}
              </text>

              {/* Prefill tokens (left side, dashed) */}
              {Array.from({ length: r.prefillLen }, (_, i) => (
                <g key={"p" + i}>
                  <rect
                    x={startX + i * colW + 2}
                    y={y + 4}
                    width={colW - 4}
                    height={28}
                    rx={4}
                    fill={tint(r.color, 8)}
                    stroke={r.color}
                    strokeWidth={1}
                    strokeDasharray="3 2"
                  />
                  <text
                    x={startX + i * colW + colW / 2}
                    y={y + 23}
                    textAnchor="middle"
                    fill={tint(r.color, 50)}
                    fontSize={10}
                    fontFamily="monospace"
                  >
                    P{i + 1}
                  </text>
                </g>
              ))}

              {/* Decoded tokens */}
              {Array.from({ length: r.decodesDone }, (_, i) => {
                const col = r.prefillLen + i;
                const isLast = i === r.decodesDone - 1 && !r.isPrefilling;
                return (
                  <g key={"d" + i}>
                    <rect
                      x={startX + col * colW + 2}
                      y={y + 4}
                      width={colW - 4}
                      height={28}
                      rx={4}
                      fill={isLast ? tint(r.color, 31) : tint(r.color, 19)}
                      stroke={r.color}
                      strokeWidth={isLast ? 2.5 : 1}
                    />
                    <text
                      x={startX + col * colW + colW / 2}
                      y={y + 23}
                      textAnchor="middle"
                      fill={r.color}
                      fontSize={10}
                      fontFamily="monospace"
                      fontWeight={isLast ? 700 : 400}
                    >
                      D{i + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        <g>
          <rect x={80} y={200} width={18} height={14} rx={3} fill={tint("var(--viz-blue)", 8)} stroke="var(--viz-blue)" strokeWidth={1} strokeDasharray="3 2" />
          <text x={104} y={212} fill="var(--viz-muted)" fontSize={10} fontFamily="monospace">prefill (cached)</text>
          <rect x={250} y={200} width={18} height={14} rx={3} fill={tint("var(--viz-blue)", 19)} stroke="var(--viz-blue)" strokeWidth={1} />
          <text x={274} y={212} fill="var(--viz-muted)" fontSize={10} fontFamily="monospace">decoded</text>
          <rect x={370} y={200} width={18} height={14} rx={3} fill={tint("var(--viz-blue)", 31)} stroke="var(--viz-blue)" strokeWidth={2.5} />
          <text x={394} y={212} fill="var(--viz-muted)" fontSize={10} fontFamily="monospace">current (shared pass)</text>
        </g>

        {/* Event banner */}
        {event && (
          <g>
            <rect x={100} y={220} width={500} height={22} rx={4} fill="var(--viz-green-soft)" stroke="var(--viz-green)" strokeWidth={1} />
            <text x={350} y={235} textAnchor="middle" fill="var(--viz-green)" fontSize={11} fontFamily="monospace" fontWeight={600}>
              {event}
            </text>
          </g>
        )}
      </svg>
    </AnimatedDiagram>
  );
}

/* ───────────────────────── ThroughputChart ───────────────────────── */

function ThroughputChart({ data, title, xLabel, xKey, yMax, unit = "tok/s", width = 640, height = 280 }) {
  const pct = unit === "%";
  const pad = { top: 30, right: 20, bottom: 45, left: 65 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  const xVals = data.map((d) => d[xKey]);
  const barW = Math.min(cw / xVals.length - 8, 50);

  return (
    <div style={chartCard}>
      <div style={{ fontSize: "0.9em", fontWeight: 600, color: "var(--viz-text)", marginBottom: "0.5em" }}>
        {title}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }} role="img" aria-label={title}>
        {/* Y gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = pad.top + ch * (1 - f);
          const val = Math.round(yMax * f);
          return (
            <g key={f}>
              <line x1={pad.left} y1={y} x2={pad.left + cw} y2={y} stroke="var(--viz-grid)" strokeWidth={1} />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fill="var(--viz-faint)" fontSize={11} fontFamily="monospace">
                {pct ? `${val}%` : val >= 1000 ? `${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}k` : val}
              </text>
            </g>
          );
        })}
        <text x={pad.left - 8} y={pad.top - 10} textAnchor="end" fill="var(--viz-faint)" fontSize={10} fontFamily="monospace">
          {pct ? "% of time" : unit}
        </text>

        {/* Bars */}
        {data.map((d, i) => {
          const x = pad.left + (i + 0.5) * (cw / xVals.length) - barW / 2;
          const barH = (d.tokS / yMax) * ch;
          const y = pad.top + ch - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx={3} fill={d.color || "var(--viz-blue)"} opacity={0.85} />
              <text x={x + barW / 2} y={y - 5} textAnchor="middle" fill={d.color || "var(--viz-blue)"} fontSize={10} fontFamily="monospace" fontWeight={600}>
                {pct ? `${d.tokS}%` : d.tokS >= 1000 ? `${(d.tokS / 1000).toFixed(1)}k` : Math.round(d.tokS)}
              </text>
              <text x={x + barW / 2} y={pad.top + ch + 16} textAnchor="middle" fill="var(--viz-faint)" fontSize={10} fontFamily="monospace">
                {d[xKey]}
              </text>
            </g>
          );
        })}

        {/* X label */}
        <text x={pad.left + cw / 2} y={height - 4} textAnchor="middle" fill="var(--viz-faint)" fontSize={11} fontFamily="monospace">
          {xLabel}
        </text>
      </svg>
    </div>
  );
}

/* ───────────────────────── ComparisonLineChart ───────────────────────── */

function ComparisonLineChart({ series, title, xLabel, yLabel, yMax, logX, width = 640, height = 300 }) {
  const legendRows = Math.ceil(series.length / 3);
  const pad = { top: 35 + (legendRows - 1) * 18, right: 20, bottom: 50, left: 65 };
  height += (legendRows - 1) * 18;
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  // Collect all x values
  const allX = [...new Set(series.flatMap((s) => s.points.map((p) => p[0])))].sort((a, b) => a - b);

  const xPos = (v) => {
    if (logX) {
      const minLog = Math.log2(allX[0]);
      const maxLog = Math.log2(allX[allX.length - 1]);
      return pad.left + ((Math.log2(v) - minLog) / (maxLog - minLog)) * cw;
    }
    return pad.left + ((v - allX[0]) / (allX[allX.length - 1] - allX[0])) * cw;
  };
  const yPos = (v) => pad.top + ch * (1 - v / yMax);

  return (
    <div style={chartCard}>
      <div style={{ fontSize: "0.9em", fontWeight: 600, color: "var(--viz-text)", marginBottom: "0.5em" }}>
        {title}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }} role="img" aria-label={title}>
        {/* Y grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = yPos(yMax * f);
          const val = yMax * f;
          return (
            <g key={f}>
              <line x1={pad.left} y1={y} x2={pad.left + cw} y2={y} stroke="var(--viz-grid)" strokeWidth={1} />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fill="var(--viz-faint)" fontSize={10} fontFamily="monospace">
                {val >= 1000 ? `${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}k` : Math.round(val)}
              </text>
            </g>
          );
        })}
        <text x={pad.left - 8} y={pad.top - 10} textAnchor="end" fill="var(--viz-faint)" fontSize={10} fontFamily="monospace">
          {yLabel}
        </text>

        {/* X labels */}
        {allX.map((v) => (
          <text key={v} x={xPos(v)} y={pad.top + ch + 16} textAnchor="middle" fill="var(--viz-faint)" fontSize={10} fontFamily="monospace">
            {v}
          </text>
        ))}
        <text x={pad.left + cw / 2} y={height - 4} textAnchor="middle" fill="var(--viz-faint)" fontSize={11} fontFamily="monospace">
          {xLabel}
        </text>

        {/* Lines */}
        {series.map((s) => {
          const pts = s.points.map((p) => `${xPos(p[0])},${yPos(p[1])}`).join(" ");
          return (
            <g key={s.label}>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              {s.points.map((p, i) => (
                <circle key={i} cx={xPos(p[0])} cy={yPos(p[1])} r={3.5} fill={s.color} />
              ))}
            </g>
          );
        })}

        {/* Legend */}
        {series.map((s, i) => (
          <g key={s.label}>
            <rect x={pad.left + 10 + (i % 3) * 175} y={7 + Math.floor(i / 3) * 18} width={12} height={12} rx={2} fill={s.color} />
            <text x={pad.left + 26 + (i % 3) * 175} y={17 + Math.floor(i / 3) * 18} fill="var(--viz-text)" fontSize={11} fontFamily="monospace">
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ───────────────────────── JourneyChart ───────────────────────── */

const JOURNEY = [
  { label: "1 · Baseline", single: null, peak: null },
  { label: "2 · KV cache", single: 59, peak: 83 },
  { label: "3 · Static batch*", single: 98, peak: 1204 },
  { label: "4 · Cont. batch v1", single: 47, peak: 389 },
  { label: "5 · Admission ctrl", single: 75, peak: 602 },
  { label: "Final engine", single: 66, peak: 788, highlight: true },
  { label: "vLLM (reference)", single: 270, peak: 9370, ref: true },
];

function JourneyChart() {
  const W = 660;
  const labelW = 150;
  const padR = 64;
  const top = 44;
  const rowH = 44;
  const barH = 13;
  const H = top + JOURNEY.length * rowH + 28;
  const cw = W - labelW - padR;
  const x = (v) => labelW + ((Math.log10(v) - 1) / 3) * cw;
  const fmt = (v) => (v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : v);

  return (
    <div style={chartCard}>
      <div style={{ fontSize: "0.9em", fontWeight: 600, color: "var(--viz-text)", marginBottom: "0.5em" }}>
        Every stage at a glance: throughput, log scale
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", maxWidth: W }}
        role="img"
        aria-label="LLM inference server throughput at every stage, from KV cache to the final engine and vLLM: 1-request and peak tokens per second"
      >
        <rect x={labelW} y={8} width={12} height={12} rx={2} fill="var(--viz-blue)" />
        <text x={labelW + 18} y={18} fill="var(--viz-text)" fontSize={11}>1 request</text>
        <rect x={labelW + 120} y={8} width={12} height={12} rx={2} fill="var(--viz-green)" />
        <text x={labelW + 138} y={18} fill="var(--viz-text)" fontSize={11}>peak (any load)</text>

        {[10, 100, 1000, 10000].map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={top - 6} x2={x(t)} y2={top + JOURNEY.length * rowH} stroke="var(--viz-grid)" />
            <text x={x(t)} y={H - 10} textAnchor="middle" fill="var(--viz-faint)" fontSize={10}>
              {fmt(t)} tok/s
            </text>
          </g>
        ))}

        {JOURNEY.map((r, i) => {
          const y = top + i * rowH;
          return (
            <g key={r.label}>
              {r.ref && (
                <line x1={8} y1={y - 4} x2={W - 8} y2={y - 4} stroke="var(--viz-border)" strokeDasharray="4 3" />
              )}
              <text
                x={labelW - 10}
                y={y + 20}
                textAnchor="end"
                fill={r.ref ? "var(--viz-muted)" : "var(--viz-text)"}
                fontSize={11.5}
                fontWeight={r.highlight ? 700 : 400}
                fontStyle={r.ref ? "italic" : "normal"}
              >
                {r.label}
              </text>
              {r.single == null ? (
                <text x={labelW + 6} y={y + 20} fill="var(--viz-faint)" fontSize={10.5} fontStyle="italic">
                  not benchmarked: no streaming, recomputes every token
                </text>
              ) : (
                <>
                  <rect x={labelW} y={y + 2} width={x(r.single) - labelW} height={barH} rx={2} fill="var(--viz-blue)" opacity={r.ref ? 0.5 : 0.9} />
                  <text x={x(r.single) + 5} y={y + 12} fill="var(--viz-blue)" fontSize={10} fontWeight={600}>
                    {fmt(r.single)}
                  </text>
                  <rect x={labelW} y={y + 2 + barH + 3} width={x(r.peak) - labelW} height={barH} rx={2} fill="var(--viz-green)" opacity={r.ref ? 0.5 : 0.9} />
                  <text x={x(r.peak) + 5} y={y + 12 + barH + 3} fill="var(--viz-green)" fontSize={10} fontWeight={600}>
                    {fmt(r.peak)}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <p style={captionStyle}>
        * Static batching receives all prompts in one call, so it is an upper bound, not a server
        handling separate requests.
      </p>
    </div>
  );
}

function StatCard({ value, label, detail, color }) {
  return (
    <div style={{ flex: "1 1 140px", minWidth: 140 }}>
      <div style={{ fontSize: "1.5em", fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: "0.85em", color: "var(--viz-text)", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: "0.75em", color: "var(--viz-muted)" }}>{detail}</div>
    </div>
  );
}

const th = { textAlign: "right", padding: "0.45em 0.5em", fontSize: "0.8em", whiteSpace: "nowrap" };
const td = { textAlign: "right", padding: "0.45em 0.5em", fontSize: "0.8em" };

/* ───────────────────────── BLOG CONTENT ───────────────────────── */

const title = "Building an LLM Inference Server from Scratch: KV Cache, Continuous Batching and vLLM";

const content = (
  <div className="ifs-viz" style={{ width: "100%" }}>
    <style>{VIZ_CSS}</style>
    <p>
      vLLM serves 9,370 tokens per second on an 8 GB GPU. My server, built from
      scratch, manages 788. That's a 12× gap at peak load (about 4× with a
      single request). Because I built each piece myself and benchmarked it along the
      way, I can point to the main sources of that gap.
    </p>
    <p>
      This post walks through building an LLM inference server one optimization
      at a time: no KV cache, then KV cache, then static batching, then
      continuous batching with live cache editing, then admission control. Each
      step is benchmarked on the same hardware with the same model, so you can
      see exactly what each technique buys you — and what it doesn't.
    </p>
    <p>
      The goal isn't to build a production server. It's to understand{" "}
      <em>why</em> production servers are built the way they are.
    </p>

    <h2>Setup</h2>
    <p>
      Everything runs on one NVIDIA GPU with about 8 GB of VRAM, serving{" "}
      <a
        href="https://huggingface.co/Qwen/Qwen2.5-0.5B"
        target="_blank"
        rel="noreferrer"
      >
        Qwen2.5-0.5B
      </a>
      . The server is a FastAPI app. Each benchmark uses closed-loop load
      testing: each client sends a new request the moment its previous one
      finishes. We vary the number of concurrent clients and measure four things:
    </p>
    <ul>
      <li>
        <b>TTFT</b> — time to first token (how long the user waits before text
        starts streaming)
      </li>
      <li>
        <b>TPOT</b> — time per output token (how fast the stream flows once it
        starts)
      </li>
      <li>
        <b>Throughput</b> — total tokens per second across all requests
      </li>
      <li>
        <b>Tail latency</b> — p95 and p99 total request time
      </li>
    </ul>
    <p>
      All results use <code>max_length=64</code>. The full code is at{" "}
      <a
        href="https://github.com/NotShrirang/inference-from-scratch"
        target="_blank"
        rel="noreferrer"
      >
        github.com/NotShrirang/inference-from-scratch
      </a>
      .
    </p>

    {/* ───────────── STEP 1 ───────────── */}
    <h2>Step 1: The Baseline (No Cache, No Batching)</h2>
    <p>
      The simplest possible server: take a prompt, generate tokens one at a
      time, return the result. No KV cache, no batching, no streaming. Each new
      token requires reprocessing the entire sequence from scratch.
    </p>

    <BaselineAnimation />

    <Code
      language="python"
      content={`class ChatModel:
    def generate(self, prompt: str, max_length: int = 64):
        input_ids = self.tokenizer.encode(prompt)

        for _ in range(max_length):
            # Reprocess ENTIRE sequence every step
            outputs = self.model(input_ids)
            next_token = sample(outputs.logits[:, -1, :])
            input_ids = torch.cat([input_ids, next_token], dim=-1)

            if next_token == self.tokenizer.eos_token_id:
                break

        return self.tokenizer.decode(input_ids)`}
      expander={false}
      copy={true}
    />
    <p>
      This is deliberately terrible. At step 50, the model processes all 50
      previous tokens just to produce token 51. No streaming either: the user
      waits for the full response.
    </p>
    <p>
      How bad is it? Take one forward pass over <i>L</i> tokens, with hidden
      size <i>d</i>. Each layer does two kinds of work:
    </p>
    <ul>
      <li>
        <b>Projections and MLP</b> (the matrix multiplies with the weights):
        about <i>L·d²</i>, linear in <i>L</i>.
      </li>
      <li>
        <b>Attention scores</b> (every token attends to every token): about{" "}
        <i>L²·d</i>, quadratic in <i>L</i>.
      </li>
    </ul>
    <p>
      The baseline runs that full pass again for every new token, with{" "}
      <i>L</i> = 1, 2, …, <i>N</i>. Summing over all steps, the weight work
      grows as <i>N²·d²</i> and the attention work as <i>N³·d</i>: quadratic
      and cubic in sequence length. A KV cache (Step 2) processes only the new
      token at each step, which brings these down to <i>N·d²</i> and{" "}
      <i>N²·d</i>. At the lengths in this post (around 100 tokens, while
      Qwen2.5-0.5B has <i>d</i> = 896), <i>L</i> stays well below <i>d</i>,
      so the weight work dominates and the waste you'd actually see is closer
      to the quadratic term. The cubic attention term takes over for long
      sequences.
    </p>
    <p>
      I didn't benchmark this step: it has no streaming endpoint, so there is
      no TTFT or TPOT to measure. The first token arrives only with the whole
      response. It exists only to establish the floor.
    </p>

    {/* ───────────── STEP 2 ───────────── */}
    <h2>Step 2: KV Cache</h2>
    <p>
      The attention mechanism computes key and value projections for every token
      at every layer. For token 51, the keys and values for tokens 1–50 are
      identical to what we computed at token 50 — we're redoing work. The KV
      cache stores these projections so each step only processes the new token:
    </p>

    <KVCacheAnimation />

    <Code
      language="python"
      content={`def generate_stream(self, prompt: str, max_length: int = 64):
    input_ids = self.tokenizer.encode(prompt)
    past_key_values = None  # KV cache starts empty

    for i in range(max_length):
        outputs = self.model(
            input_ids if i == 0 else input_ids[:, -1:],  # full prompt or just last token
            past_key_values=past_key_values,
            use_cache=True,
        )
        past_key_values = outputs.past_key_values  # store for next step

        next_token = sample(outputs.logits[:, -1, :])
        input_ids = torch.cat([input_ids, next_token], dim=-1)

        yield next_token  # stream each token as it's generated`}
      expander={false}
      copy={true}
    />

    <ThroughputChart
      data={[
        { conc: 1, tokS: 59.2, color: "var(--viz-faint)" },
        { conc: 2, tokS: 75.0, color: "var(--viz-faint)" },
        { conc: 4, tokS: 78.6, color: "var(--viz-faint)" },
        { conc: 8, tokS: 82.6, color: "var(--viz-faint)" },
        { conc: 16, tokS: 83.4, color: "var(--viz-faint)" },
      ]}
      title="Step 2: KV Cache — Throughput vs Concurrency"
      xLabel="concurrent requests"
      xKey="conc"
      yMax={120}
    />

    <table style={{ width: "100%", borderCollapse: "collapse", margin: "1em 0" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--viz-border)" }}>
          <th style={{ textAlign: "left", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Concurrency</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Throughput</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>TTFT p50</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>TPOT p50</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>e2e p99</th>
        </tr>
      </thead>
      <tbody>
        {[
          [1, "59 tok/s", "23 ms", "12 ms", "1.44 s"],
          [2, "75 tok/s", "66 ms", "24 ms", "1.81 s"],
          [4, "79 tok/s", "89 ms", "47 ms", "3.47 s"],
          [8, "83 tok/s", "207 ms", "90 ms", "6.43 s"],
          [16, "83 tok/s", "379 ms", "179 ms", "12.5 s"],
        ].map(([c, tp, ttft, tpot, e2e]) => (
          <tr key={c} style={{ borderBottom: "1px solid var(--viz-border)" }}>
            <td style={{ padding: "0.4em 0.6em", fontSize: "0.85em" }}>{c}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{tp}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{ttft}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{tpot}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{e2e}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p>
      The flat throughput is the key observation. With the KV cache, a single
      request is fast — TTFT drops to 23 ms. But with 16 concurrent requests,
      throughput barely moves (59 → 83 tok/s) while TPOT grows 15× and
      end-to-end latency hits 12.5 s. The GPU sits idle while Python shuffles
      between requests.
    </p>
    <p>
      <b>Lesson:</b> The KV cache eliminates redundant computation within a
      single request. It does nothing for concurrency. For that, we need
      batching.
    </p>

    {/* ───────────── STEP 3 ───────────── */}
    <h2>Step 3: Static Batching</h2>
    <p>
      Instead of processing one prompt at a time, batch N prompts together into
      a single forward pass. The GPU reads the model weights once and applies
      them to all sequences simultaneously:
    </p>

    <BatchingAnimation />

    <Code
      language="python"
      content={`def generate_batch(self, prompts: list[str], max_length: int = 64):
    # Left-pad so all sequences align on the right (generation end)
    inputs = self.tokenizer(
        prompts, padding=True, padding_side="left",
        return_tensors="pt"
    ).to(self.device)

    past_key_values = None
    for i in range(max_length):
        outputs = self.model(
            inputs["input_ids"] if i == 0 else new_tokens,
            attention_mask=inputs["attention_mask"],
            past_key_values=past_key_values,
            use_cache=True,
        )
        past_key_values = outputs.past_key_values
        new_tokens = sample(outputs.logits[:, -1, :])

        # Extend attention mask for the new position
        inputs["attention_mask"] = torch.cat([
            inputs["attention_mask"],
            torch.ones(len(prompts), 1, device=self.device)
        ], dim=1)`}
      expander={false}
      copy={true}
    />

    <ThroughputChart
      data={[
        { batch: 1, tokS: 97.8, color: "var(--viz-blue)" },
        { batch: 2, tokS: 147.9, color: "var(--viz-blue)" },
        { batch: 4, tokS: 320.7, color: "var(--viz-blue)" },
        { batch: 8, tokS: 588.6, color: "var(--viz-blue)" },
        { batch: 16, tokS: 1204.2, color: "var(--viz-green)" },
        { batch: 32, tokS: 0, color: "var(--viz-red)" },
      ]}
      title="Step 3: Static Batching — Throughput vs Batch Size"
      xLabel="batch size (32 = OOM)"
      xKey="batch"
      yMax={1400}
    />

    <table style={{ width: "100%", borderCollapse: "collapse", margin: "1em 0" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--viz-border)" }}>
          <th style={{ textAlign: "left", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Batch Size</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Throughput</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Per-sequence</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Median time</th>
        </tr>
      </thead>
      <tbody>
        {[
          [1, "98 tok/s", "98 tok/s", "0.65 s"],
          [2, "148 tok/s", "74 tok/s", "0.87 s"],
          [4, "321 tok/s", "80 tok/s", "0.80 s"],
          [8, "589 tok/s", "74 tok/s", "0.87 s"],
          [16, "1,204 tok/s", "75 tok/s", "0.85 s"],
          [32, "OOM", "—", "—"],
        ].map(([b, tp, ps, med]) => (
          <tr key={b} style={{ borderBottom: "1px solid var(--viz-border)" }}>
            <td style={{ padding: "0.4em 0.6em", fontSize: "0.85em" }}>{b}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em", fontWeight: b === 16 ? 700 : 400 }}>{tp}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{ps}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{med}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p>
      This is the most important insight in the whole project:{" "}
      <b>token generation is memory-bandwidth bound, not compute bound</b>. The
      GPU reads the model weights from memory once per step regardless of how
      many sequences are in the batch. Adding more sequences is essentially
      free — until you run out of memory for the KV caches. Per-request time
      stays flat at ~0.85 s while throughput scales ~12×.
    </p>
    <p>
      But static batching has a problem: it needs all N prompts upfront. In a
      real server, requests arrive at different times and finish at different
      times. A batch that waits for a slot to free up wastes the GPU.
    </p>

    {/* ───────────── STEP 4 ───────────── */}
    <h2>Step 4: Continuous Batching</h2>
    <p>
      This is the big one. Continuous batching (also called in-flight
      batching, or iteration-level scheduling in the{" "}
      <a href="https://www.usenix.org/conference/osdi22/presentation/yu" target="_blank" rel="noreferrer">
        Orca paper
      </a>
      ) is how vLLM, TGI and TensorRT-LLM keep the GPU busy. A background
      engine runs the model in a loop. New requests join the batch as they
      arrive; finished requests leave without stalling the rest:
    </p>

    <ContinuousBatchingAnimation />

    <Code
      language="python"
      content={`class BatchingEngine:
    """Background loop that drives the model for all active requests."""

    async def _run(self):
        while self._running:
            # Admit new requests from the waiting queue
            while self._waiting and len(self._batch) < self.batch_size:
                req = self._waiting.popleft()
                self._prefill(req)        # prefill alone, splice KV into batch
                self._batch.append(req)

            if not self._batch:
                await asyncio.sleep(0.01)  # nothing to do
                continue

            # One forward pass for the whole batch
            self._step()

            # Remove finished requests, free their KV rows
            self._evict_finished()`}
      expander={false}
      copy={true}
    />

    <h3>The Hard Part: Editing the KV Cache</h3>
    <p>
      In static batching, the cache is built once for a fixed set of prompts.
      Continuous batching means the cache must change shape while the model is
      running: a new request's cache must be spliced in, and a finished
      request's row must be removed. This is the core engineering challenge.
    </p>
    <Code
      language="python"
      content={`def _prefill(self, req):
    """Prefill a single new request and splice its KV cache into the batch."""
    outputs = self.model.forward(
        req.input_ids.unsqueeze(0),
        use_cache=True,
    )
    new_cache = outputs.past_key_values

    if self._cache is None:
        self._cache = new_cache
        return

    # The new request's cache may be shorter — left-pad it to match
    for layer in range(len(self._cache)):
        for kv in (0, 1):  # keys, values
            existing = self._cache[layer][kv]   # [batch, heads, seq, dim]
            incoming = new_cache[layer][kv]      # [1, heads, seq', dim]

            pad = existing.shape[2] - incoming.shape[2]
            if pad > 0:
                incoming = F.pad(incoming, (0, 0, pad, 0))  # left-pad seq dim

            # Concatenate on the batch dimension
            self._cache[layer][kv] = torch.cat(
                [existing, incoming], dim=0
            )`}
      expander={false}
      copy={true}
    />

    <h3>The Hardest Bug: One Line</h3>
    <p>
      The first version crashed with OOM after a few hundred requests. Memory
      climbed to 7.6 GB on a 0.5B model. The cause:
    </p>
    <Code
      language="python"
      content={`# Before (broken): autograd saves the entire KV cache at every step
def forward(self, input_ids, **kwargs):
    return self.model(input_ids, **kwargs)

# After (fixed): one decorator, memory stays flat
@torch.no_grad()
def forward(self, input_ids, **kwargs):
    return self.model(input_ids, **kwargs)`}
      expander={false}
      copy={true}
    />
    <p>
      Without <code>@torch.no_grad()</code>, PyTorch saves the full
      computational graph at every step — including the KV cache that's passed
      back in as input. Memory grows without bound. <code>model.eval()</code> does{" "}
      <b>not</b> disable gradient tracking — it only changes dropout and
      batch-norm behavior. This was the hardest bug in the project, fixed in one
      line.
    </p>

    <h3>A Subtle Position Bug</h3>
    <p>
      After splicing a new request's KV cache into the batch, positions must
      be recomputed from the attention mask. If they're wrong, RoPE applies
      incorrect rotary encodings. The model generated "Paris is" instead of
      "Paris." — no crash, no NaN, just a quietly wrong answer. The fix:
      recompute <code>position_ids</code> from the attention mask at every
      forward pass.
    </p>

    <h3>Results</h3>

    <ComparisonLineChart
      series={[
        {
          label: "KV Cache (Step 2)",
          color: "var(--viz-faint)",
          points: [[1, 59], [2, 75], [4, 79], [8, 83], [16, 83]],
        },
        {
          label: "Cont. Batch v1",
          color: "var(--viz-orange)",
          points: [[1, 47], [2, 80], [4, 145], [8, 286], [16, 389], [32, 383], [64, 382]],
        },
        {
          label: "Custom Engine (fixed)",
          color: "var(--viz-green)",
          points: [[1, 90], [2, 146], [4, 258], [8, 459], [16, 724], [32, 774], [64, 788]],
        },
      ]}
      title="Throughput Progression: KV Cache → Continuous Batching → Fixed Engine"
      xLabel="concurrent requests"
      yLabel="tok/s"
      yMax={900}
      logX
    />

    <table style={{ width: "100%", borderCollapse: "collapse", margin: "1em 0" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--viz-border)" }}>
          <th style={{ textAlign: "left", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Concurrency</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>v1 tok/s</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>Fixed tok/s</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>TPOT p50</th>
          <th style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>TTFT p50</th>
        </tr>
      </thead>
      <tbody>
        {[
          [1, 47, 90, "7 ms", "114 ms"],
          [2, 80, 146, "11 ms", "34 ms"],
          [4, 145, 258, "13 ms", "43 ms"],
          [8, 286, 459, "14 ms", "48 ms"],
          [16, 389, 724, "19 ms", "60 ms"],
          [32, 383, 774, "18 ms", "1.19 s"],
          [64, 382, 788, "18 ms", "3.53 s"],
        ].map(([c, v1, fixed, tpot, ttft]) => (
          <tr key={c} style={{ borderBottom: "1px solid var(--viz-border)" }}>
            <td style={{ padding: "0.4em 0.6em", fontSize: "0.85em" }}>{c}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{v1}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em", fontWeight: c === 64 ? 700 : 400 }}>{fixed}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{tpot}</td>
            <td style={{ textAlign: "right", padding: "0.4em 0.6em", fontSize: "0.85em" }}>{ttft}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p>
      The cache-editing and <code>no_grad</code> fixes doubled peak throughput
      from 389 to <b>788 tok/s</b>. TPOT stays under 20 ms from 1 to 64
      requests (step 2 TPOT grew 15× from 1 to 16 requests). Past the batch size
      of 16, extra load adds only waiting time — TTFT grows linearly.
    </p>

    {/* ───────────── STEP 5 ───────────── */}
    <h2>Step 5: Admission Control</h2>
    <p>
      The batch holds 16 requests. Past that, new requests wait in a queue,
      and in Step 4 that queue had no limit: at 256 concurrent requests the
      server still answered everything, but p99 latency reached 32 seconds.
      The fix is a bounded queue that rejects extra requests with HTTP 429:
    </p>
    <Code
      language="python"
      content={`class BatchingEngine:
    def __init__(self, model, batch_size=16):
        self.batch_size = batch_size
        self.max_waiting = 4 * batch_size  # bounded queue

    def submit(self, request):
        if len(self._waiting) >= self.max_waiting:
            raise HTTPException(
                status_code=429,
                detail="Server at capacity. Try again later."
            )`}
      expander={false}
      copy={true}
    />

    <ThroughputChart
      data={[
        { conc: 1, tokS: 75, color: "var(--viz-blue)" },
        { conc: 2, tokS: 130, color: "var(--viz-blue)" },
        { conc: 4, tokS: 243, color: "var(--viz-blue)" },
        { conc: 8, tokS: 400, color: "var(--viz-blue)" },
        { conc: 16, tokS: 602, color: "var(--viz-green)" },
        { conc: 32, tokS: 546, color: "var(--viz-blue)" },
        { conc: 64, tokS: 550, color: "var(--viz-blue)" },
        { conc: 128, tokS: 481, color: "var(--viz-orange)" },
        { conc: 256, tokS: 468, color: "var(--viz-orange)" },
      ]}
      title="Step 5: Admission Control — Throughput (orange = 429s)"
      xLabel="concurrent requests"
      xKey="conc"
      yMax={700}
    />

    <p>
      This doesn't increase throughput. With 16 running and 64 waiting, the
      server holds 80 requests; anything beyond that gets a 429 right away
      instead of waiting. At 128 concurrent requests, 2,323 requests were
      rejected; at 256, 1,294 were. The requests that <em>are</em> accepted
      keep a steady TPOT (22–30 ms), and p99 latency at 256 drops from 32 s to
      21 s. The value isn't speed. It's a clear contract: the server tells you
      when it's full instead of making everyone wait.
    </p>

    {/* ───────────── CAPSTONE ───────────── */}
    <h2>The Capstone: My Server vs vLLM</h2>
    <p>
      Same model (Qwen2.5-0.5B), same prompts, same measurements. Each server
      gets the full GPU to itself — vLLM takes about 90% of GPU memory at
      startup.
    </p>

    <ComparisonLineChart
      series={[
        {
          label: "Custom Engine",
          color: "var(--viz-green)",
          points: [[1, 90], [2, 146], [4, 258], [8, 459], [16, 724], [32, 774], [64, 788]],
        },
        {
          label: "vLLM",
          color: "var(--viz-purple)",
          points: [[1, 270], [2, 496], [4, 975], [8, 1850], [16, 3261], [32, 5103], [64, 7501], [128, 8806], [256, 9370]],
        },
      ]}
      title="Capstone: Custom Engine vs vLLM — Throughput"
      xLabel="concurrent requests"
      yLabel="tok/s"
      yMax={10000}
      logX
    />

    <table style={{ width: "100%", borderCollapse: "collapse", margin: "1.5em 0" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid var(--viz-border)" }}>
          <th style={{ textAlign: "left", padding: "0.5em" }}>Metric</th>
          <th style={{ textAlign: "right", padding: "0.5em" }}>Mine</th>
          <th style={{ textAlign: "right", padding: "0.5em" }}>vLLM</th>
          <th style={{ textAlign: "right", padding: "0.5em" }}>Gap</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["Throughput (1 req)", "66 tok/s*", "270 tok/s", "~4×"],
          ["Peak throughput", "788 tok/s (at 64)", "9,370 tok/s (at 256)", "~12×", true],
          ["TTFT p50 (1 req)", "30 ms*", "9 ms", "~3×"],
          ["TPOT p50 (1 req)", "13.6 ms*", "3.6 ms", "~4×"],
          ["Errors at 256 req", "902 (429s)", "0", "—"],
        ].map(([metric, mine, vllm, gap, bold]) => (
          <tr key={metric} style={{ borderBottom: "1px solid var(--viz-border)" }}>
            <td style={{ padding: "0.5em", fontWeight: bold ? 700 : 400 }}>{metric}</td>
            <td style={{ textAlign: "right", padding: "0.5em", fontWeight: bold ? 700 : 400 }}>{mine}</td>
            <td style={{ textAlign: "right", padding: "0.5em", fontWeight: bold ? 700 : 400 }}>{vllm}</td>
            <td style={{ textAlign: "right", padding: "0.5em", fontWeight: bold ? 700 : 400 }}>{gap}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p style={{ ...captionStyle, textAlign: "left", marginTop: "-0.8em" }}>
      * Measured after the streaming fix described below, in a separate run, so
      these gaps are approximate. The capstone run itself showed 90 tok/s,
      114 ms and 7.2 ms at 1 request, but its stream loop dropped tokens, which
      distorted all three. Peak throughput was not affected (see "Why the
      1-request numbers differ").
    </p>

    <p>
      These gaps are not independent, so they don't add up neatly. The 12×
      peak gap includes everything vLLM does better, and with a single request
      the throughput gap is about 4×. Here are the main sources as far as my
      measurements can show.
    </p>

    <h3>Peak throughput (~12×): mostly batch capacity</h3>
    <p>
      My engine stores the KV cache as one contiguous tensor per layer. Each
      request gets a row, left-padded to the length of the longest sequence.
      I cap the batch at 16, because with this layout batch 32 already ran out
      of memory on this GPU (Step 3). Past that, requests wait or get a 429.
    </p>
    <p>
      vLLM uses{" "}
      <a href="https://arxiv.org/abs/2309.06180" target="_blank" rel="noreferrer">
        PagedAttention
      </a>
      : the KV cache is split into fixed-size blocks allocated from a free-block
      list, like virtual memory pages. No padding, no fragmentation. This lets
      vLLM pack hundreds of sequences into the same 8 GB: its throughput is
      still climbing at 256 requests, while mine flattens after 16. Its faster
      kernels (next section) add to this gap too.
    </p>

    <h3>Per-token latency (~4×): fused kernels and CUDA graphs</h3>
    <p>
      I profiled the engine with cProfile. The forward pass alone is 85% of wall
      time — but a large chunk is Python overhead: HuggingFace's module
      dispatch, dtype casts, and ~159,000 individual CUDA kernel launches per
      100 requests. The GPU keeps waiting for Python to tell it what to do next.
    </p>
    <p>
      vLLM solves this with <b>fused kernels</b> and <b>CUDA graphs</b>.
      I tried <code>torch.compile</code> with CUDA graphs, but it recompiles
      almost every step because the batch shape changes — generation went from
      12 ms to 178 ms per step (15× slower). CUDA graphs need fixed input shapes,
      which continuous batching breaks by design.
    </p>

    <h3>Time to first token: engine overhead, not prefill</h3>
    <p>
      I first blamed slow prefill for the 13× TTFT gap. My own numbers say
      otherwise. The Step 2 server, on the same Python and PyTorch stack, had a
      23 ms TTFT. It jumped above 100 ms only once requests went through the
      engine loop (127 ms in Step 4, 117 ms in Step 5, 114 ms in the capstone).
    </p>
    <p>
      The cause was the streaming loop. It checked each request's token queue
      and slept for 0.1 s whenever the queue was empty, so the first token
      could sit waiting for up to 100 ms:
    </p>
    <Code
      language="python"
      content={`# Before: poll the queue, sleep 0.1 s when it is empty
while not req.finished:
    if not req.queue.empty():
        token = await req.queue.get()
        if token is None:
            break
        yield decode(token)
    else:
        await asyncio.sleep(0.1)

# After: wait on the queue until the end-of-stream marker
while (token := await req.queue.get()) is not None:
    yield decode(token)`}
      expander={false}
      copy={true}
    />
    <p>
      In before-and-after runs on the same day, TTFT at 1 request dropped from
      116 ms to <b>30 ms</b>, and it stays between 37 and 55 ms from 2 to 16
      requests. The fix also stopped the loop from dropping the last few tokens
      of a request. That brings the gap to vLLM's 9 ms down to roughly 3×.
      I haven't broken down the remaining ~20 ms yet. Likely candidates are
      the engine loop's 5 ms idle sleep, prefilling each new request on its
      own and splicing its cache into the batch, and Python request handling.
    </p>

    {/* ───────────── PROFILE ───────────── */}
    <h2>Where the Time Goes: A Profile</h2>
    <p>
      cProfile breakdown of the continuous-batching engine (100 requests, 8
      concurrent, Qwen2.5-0.5B):
    </p>

    <ThroughputChart
      data={[
        { component: "decode", tokS: 79.8, color: "var(--viz-blue)" },
        { component: "prefill", tokS: 6.5, color: "var(--viz-green)" },
        { component: "tensors", tokS: 3.6, color: "var(--viz-orange)" },
        { component: "tolist()", tokS: 3.4, color: "var(--viz-purple)" },
        { component: "sampling", tokS: 3.3, color: "var(--viz-red)" },
        { component: "cache edit", tokS: 1.2, color: "var(--viz-faint)" },
        { component: "endpoint", tokS: 1.5, color: "var(--viz-border-strong)" },
      ]}
      title="Time Breakdown by Component (%)"
      xLabel=""
      xKey="component"
      yMax={100}
      unit="%"
      height={240}
    />

    <p>
      Two things stand out. First, the endpoint code (FastAPI, async queues) is
      1.5% — the web framework is not the bottleneck. Second, cache editing —
      the complicated part — is only 1.2%. The forward pass dominates at 85%,
      and within that, it's mostly Python-side overhead in HuggingFace's model
      layers, not GPU compute.
    </p>

    {/* ───────────── JOURNEY ───────────── */}
    <h2>The Whole Journey: Where It Started, Where It Ended</h2>
    <p>
      Here is every stage in one place, from the naive loop to the final
      engine, with vLLM on the same GPU as the reference point. Every number
      comes from the benchmark files in the repo (Qwen2.5-0.5B,{" "}
      <code>max_length=64</code>, one 8 GB GPU).
    </p>

    <div style={{ overflowX: "auto", margin: "1.5em 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--viz-border)" }}>
            <th style={{ ...th, textAlign: "left" }}>Stage</th>
            <th style={th}>1 req</th>
            <th style={th}>Peak</th>
            <th style={th}>TTFT p50</th>
            <th style={th}>TPOT p50</th>
            <th style={{ ...th, textAlign: "left" }}>Heavy load</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["1 · Baseline", "Naive loop: whole sequence recomputed per token", "—", ["—", "not benchmarked"], "—", "—", ["—", "no streaming endpoint"]],
            ["2 · KV cache", "Reuse past keys and values", "59 tok/s", ["83 tok/s", "at 16 req"], "23 ms", "12 ms", ["12.5 s p99", "at 16 req"]],
            ["3 · Static batching*", "N prompts in one forward pass", "98 tok/s", ["1,204 tok/s", "at batch 16"], "—", "—", ["Out of memory", "at batch 32"]],
            ["4 · Continuous batching v1", "Engine loop; requests join and leave", "47 tok/s", ["389 tok/s", "at 16 req"], "127 ms", "16 ms", ["32 s p99 at 256", "queue has no limit"]],
            ["5 · Admission control", "Bounded queue, HTTP 429 when full", "75 tok/s", ["602 tok/s", "at 16 req"], "117 ms", "9 ms", ["21 s p99 at 256", "extra requests get 429"]],
            ["Final engine", "Steps 4 + 5 with KV cache editing and no_grad", "66 tok/s†", ["788 tok/s", "at 64 req"], "30 ms†", "14 ms†", ["17 s p99 at 256", "0 errors up to 64"]],
            ["vLLM (reference)", "PagedAttention, fused kernels, CUDA graphs", "270 tok/s", ["9,370 tok/s", "at 256 req"], "9 ms", "3.6 ms", ["2.1 s p99 at 256", "0 errors"]],
          ].map(([stage, what, single, peak, ttft, tpot, load]) => {
            const final = stage === "Final engine";
            const ref = stage.startsWith("vLLM");
            return (
              <tr
                key={stage}
                style={{
                  borderBottom: "1px solid var(--viz-border)",
                  borderTop: ref ? "2px dashed var(--viz-border)" : undefined,
                  background: final ? tint("var(--viz-green)", 10) : undefined,
                  fontWeight: final ? 700 : 400,
                  fontStyle: ref ? "italic" : "normal",
                }}
              >
                <td style={{ ...td, textAlign: "left", minWidth: 140 }}>
                  <div style={{ fontWeight: final ? 700 : 600 }}>{stage}</div>
                  <div style={{ fontSize: "0.88em", color: "var(--viz-muted)", fontWeight: 400 }}>{what}</div>
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>{single}</td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  <div>{peak[0]}</div>
                  <div style={{ fontSize: "0.88em", color: "var(--viz-muted)", fontWeight: 400 }}>{peak[1]}</div>
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>{ttft}</td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>{tpot}</td>
                <td style={{ ...td, textAlign: "left", minWidth: 110 }}>
                  <div>{load[0]}</div>
                  <div style={{ fontSize: "0.88em", color: "var(--viz-muted)", fontWeight: 400 }}>{load[1]}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ ...captionStyle, textAlign: "left" }}>
        TTFT and TPOT are measured at 1 request; "at 16 req" means 16
        concurrent requests. † From the run after the streaming fix; the peak
        and heavy-load numbers are from the capstone run. * Static batching
        receives every
        prompt in one call, so it is an upper bound rather than a server
        handling separate requests.
      </p>
    </div>

    <JourneyChart />

    <ComparisonLineChart
      series={[
        {
          label: "2 · KV cache",
          color: "var(--viz-faint)",
          points: [[1, 59], [2, 75], [4, 79], [8, 83], [16, 83]],
        },
        {
          label: "4 · Cont. batch v1",
          color: "var(--viz-orange)",
          points: [[1, 47], [2, 80], [4, 145], [8, 286], [16, 389], [32, 383], [64, 382], [128, 382], [256, 377]],
        },
        {
          label: "5 · Admission ctrl",
          color: "var(--viz-blue)",
          points: [[1, 75], [2, 130], [4, 243], [8, 400], [16, 602], [32, 546], [64, 550], [128, 481], [256, 468]],
        },
        {
          label: "Final engine",
          color: "var(--viz-green)",
          points: [[1, 90], [2, 146], [4, 258], [8, 459], [16, 724], [32, 774], [64, 788], [128, 589], [256, 727]],
        },
      ]}
      title="Throughput vs concurrency for every streaming stage"
      xLabel="concurrent requests (past 64, the final engine rejects extra requests with 429s)"
      yLabel="tok/s"
      yMax={900}
      logX
    />

    <p>What it all adds up to, comparing the final engine with the Step 2 server:</p>

    <div style={{ ...chartCard, display: "flex", flexWrap: "wrap", gap: "1.2em", justifyContent: "space-between" }}>
      <StatCard value="9.4×" label="Peak throughput" detail="83 → 788 tok/s" color="var(--viz-green)" />
      <StatCard value="8.4×" label="Lower p99 at 16 req" detail="12.5 s → 1.5 s" color="var(--viz-blue)" />
      <StatCard value="6.9×" label="Lower TTFT at 16 req" detail="379 → 55 ms" color="var(--viz-purple)" />
      <StatCard value="12×" label="Gap left to vLLM" detail="788 vs 9,370 tok/s" color="var(--viz-orange)" />
    </div>

    <p>
      One number went the wrong way for a while. TTFT for a single request
      rose from 23 ms to 114 ms once requests went through the engine loop,
      because of the 0.1 s polling sleep. After the fix it is 30 ms, close to
      Step 2 again, and it stays under 55 ms up to 16 concurrent requests,
      while Step 2's grows to 379 ms at 16.
    </p>

    <h3>Why the 1-request numbers differ</h3>
    <p>
      The single-request throughput jumps around between stages: 59, 98, 47,
      75, 90 tok/s. Those numbers don't all measure the same thing. Some come
      from different benchmark scripts, and some from runs with a bug in the
      streaming loop:
    </p>

    <div style={{ overflowX: "auto", margin: "1.2em 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--viz-border)" }}>
            <th style={{ ...th, textAlign: "left" }}>Run</th>
            <th style={th}>1 req</th>
            <th style={{ ...th, textAlign: "left" }}>How it was measured</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["2 · KV cache", "Simple loop, no engine", "59 tok/s", "Streaming endpoint, all 64 tokens delivered. Clean."],
            ["3 · Static batching", "Batch of one prompt", "98 tok/s", "A different script: one non-streaming call, median of 3, tokens assumed to be 64. No per-token streaming, so it isn't comparable with the other rows."],
            ["4 · Continuous batching v1", "Recomputed the batch when it changed", "47 tok/s", "Streaming, with the stream bug."],
            ["5 · Admission control", "Engine before the no_grad fix", "75 tok/s", "Streaming, with the stream bug."],
            ["Final engine (capstone run)", "KV cache editing and no_grad", "90 tok/s", "Streaming, with the stream bug."],
            ["Final engine (after fix)", "Same engine, stream loop fixed", "66 tok/s", "Streaming, about 62 of 64 tokens delivered. Clean."],
          ].map(([run, what, tps, how]) => {
            const clean = how.endsWith("Clean.");
            return (
              <tr key={run} style={{ borderBottom: "1px solid var(--viz-border)", background: clean ? tint("var(--viz-green)", 8) : undefined }}>
                <td style={{ ...td, textAlign: "left", minWidth: 150 }}>
                  <div style={{ fontWeight: 600 }}>{run}</div>
                  <div style={{ fontSize: "0.88em", color: "var(--viz-muted)" }}>{what}</div>
                </td>
                <td style={{ ...td, whiteSpace: "nowrap", fontWeight: 600 }}>{tps}</td>
                <td style={{ ...td, textAlign: "left" }}>{how}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <p>
      <b>The stream bug.</b> Until the fix, the streaming loop could exit while
      tokens were still in the queue, so those runs delivered only 49 to 54 of
      the 64 tokens per request. The 0.1 s polling also delivered tokens in
      bursts. Shorter streams and bursty arrivals make requests look faster
      and the gaps between tokens look smaller, and the next request could
      start while the engine was still finishing the previous one. So the 47,
      75 and 90 tok/s results can't be compared cleanly with Step 2, and the
      7.2 ms per-token time from the capstone run was an artifact: the same
      engine measures 13.6 ms after the fix.
    </p>
    <p>
      <b>The clean comparison.</b> With one request, the fixed engine does 66
      tok/s against Step 2's 59, but its time per token is slightly worse
      (13.6 vs 11.7 ms). With nothing to batch, the engine's extra
      bookkeeping doesn't pay for itself; its advantage only shows with
      concurrency. Under load the bug barely mattered: same-day runs before
      and after the fix peak at 738 and 744 tok/s, with about 20 ms per token
      in both, which is why the peak numbers in this post stand.
    </p>

    {/* ───────────── LESSONS ───────────── */}
    <h2>What I Learned</h2>

    <h3>1. Decoding is memory-bandwidth bound</h3>
    <p>
      The GPU reads the entire model from memory at every decode step, regardless
      of how many sequences are in the batch. This is why batching gives a near-
      linear throughput increase for free: the per-step cost is dominated by the
      weight read, not by the computation.
    </p>

    <h3>2. The KV cache is the central design problem</h3>
    <p>
      Every interesting decision in an inference server comes back to the KV
      cache: how to store it, how to grow it, how to share it, and how to decide
      when you're out of room. The cache decides your maximum batch size, which
      decides your throughput.
    </p>

    <h3>3. Measure before you explain a gap</h3>

    <div style={{ ...chartCard, display: "flex", justifyContent: "space-around", flexWrap: "wrap", textAlign: "center", gap: "1em" }}>
      <div>
        <div style={{ fontSize: "1.8em", fontWeight: 700, color: "var(--viz-purple)" }}>~12×</div>
        <div style={{ fontSize: "0.85em", color: "var(--viz-text)", fontWeight: 600 }}>Peak throughput</div>
        <div style={{ fontSize: "0.75em", color: "var(--viz-muted)" }}>mostly batch capacity (PagedAttention)</div>
      </div>
      <div>
        <div style={{ fontSize: "1.8em", fontWeight: 700, color: "var(--viz-orange)" }}>~4×</div>
        <div style={{ fontSize: "0.85em", color: "var(--viz-text)", fontWeight: 600 }}>Per-token latency</div>
        <div style={{ fontSize: "0.75em", color: "var(--viz-muted)" }}>fused kernels, CUDA graphs</div>
      </div>
      <div>
        <div style={{ fontSize: "1.8em", fontWeight: 700, color: "var(--viz-blue)" }}>13× → ~3×</div>
        <div style={{ fontSize: "0.85em", color: "var(--viz-text)", fontWeight: 600 }}>Time to first token</div>
        <div style={{ fontSize: "0.75em", color: "var(--viz-muted)" }}>mostly my own engine's overhead</div>
      </div>
    </div>

    <p>
      These are the main sources of the vLLM gap, not a complete breakdown;
      they overlap, and the peak number includes everything vLLM does better.
      My first explanation for the TTFT gap (slow prefill) was wrong. Comparing
      against my own Step 2 numbers pointed at the engine loop, and one line of
      code removed most of it. The other two gaps need custom GPU kernels,
      which is where I stopped: the goal was to understand what each technique
      does, not to close the gap.
    </p>

    <h3>4. eval() ≠ no_grad()</h3>
    <p>
      <code>model.eval()</code> changes dropout and batch-norm behavior.{" "}
      <code>torch.no_grad()</code> disables gradient tracking. During inference,
      you need <b>both</b>, and the second one is the one that matters for
      memory. Without it, autograd silently saves every intermediate tensor, and
      your 0.5B model eats 7.6 GB.
    </p>

    <h3>5. The position bug teaches you RoPE</h3>
    <p>
      When a new request joins the batch with left-padding, its tokens start at
      a different position than existing requests. If you pass wrong position IDs,
      RoPE applies incorrect rotary encodings. The output isn't garbage — it's
      subtly wrong. "Paris is" instead of "Paris." — no crash, only catchable by
      comparing single-request vs batched outputs.
    </p>

    {/* ───────────── PROGRESS ───────────── */}
    <h2>The Progress So Far</h2>
    <p>
      Steps completed: baseline, KV cache, static batching, continuous batching
      with cache editing, admission control, and the vLLM capstone. Steps on the
      list but not yet done: quantized model serving (next), prefix caching,
      speculative decoding, different attention types (GQA/MQA, sliding window),
      monitoring, structured output, and an OpenAI-compatible API.
    </p>
    <p>
      Out of scope by design: custom GPU kernels (PagedAttention kernel, fused
      attention, FlashAttention) and multi-GPU. The vLLM comparison suggests
      these are behind most of the remaining throughput and per-token gap, and
      they don't fit a "build it in Python to understand it" project.
    </p>

    {/* ───────────── TRY IT ───────────── */}
    <h2>Try It</h2>
    <Code
      language="bash"
      content={`git clone https://github.com/NotShrirang/inference-from-scratch.git
cd inference-from-scratch
uv venv .venv
source .venv/bin/activate
uv sync
python main.py  # serves on http://localhost:8000`}
      expander={false}
      copy={true}
    />
    <p>Run the benchmarks yourself:</p>
    <Code
      language="bash"
      content={`# Benchmark the continuous-batching endpoint
python scripts/benchmark_endpoint.py \\
    --model Qwen/Qwen2.5-0.5B --load \\
    --endpoint generate-continuous-batch

# Save and plot
cp bench_endpoint_results.json benchmarks/step8_admission_control.json
python scripts/plot_endpoint.py \\
    --results benchmarks/step8_admission_control.json \\
    --out benchmarks/step8_admission_control.png \\
    --title "Step 5: Admission Control (Qwen2.5-0.5B)"

# Compare all steps on one plot
python scripts/board.py compare --out benchmarks/step_comparison.png`}
      expander={false}
      copy={true}
    />
    <p>
      The repo has benchmark scripts for every step, a comparison board that
      plots them side by side, and a contamination checker that verifies batched
      requests don't mix outputs. Everything runs on a single 8 GB GPU.
    </p>
    <p>
      Code:{" "}
      <a
        href="https://github.com/NotShrirang/inference-from-scratch"
        target="_blank"
        rel="noreferrer"
      >
        github.com/NotShrirang/inference-from-scratch
      </a>
    </p>

    <h2>References</h2>
    <ul>
      <li>
        <a href="https://arxiv.org/abs/2309.06180" target="_blank" rel="noreferrer">
          Efficient Memory Management for Large Language Model Serving with
          PagedAttention (Kwon et al., 2023)
        </a>
      </li>
      <li>
        <a href="https://arxiv.org/abs/2206.04664" target="_blank" rel="noreferrer">
          Orca: A Distributed Serving System for Transformer-Based Generative
          Models (Yu et al., 2022)
        </a>{" "}
        — the continuous batching paper
      </li>
      <li>
        <a href="https://arxiv.org/abs/2205.14135" target="_blank" rel="noreferrer">
          FlashAttention: Fast and Memory-Efficient Exact Attention with
          IO-Awareness (Dao et al., 2022)
        </a>
      </li>
      <li>
        <a href="https://docs.vllm.ai/" target="_blank" rel="noreferrer">
          vLLM Documentation
        </a>
      </li>
    </ul>
  </div>
);

const slug = "building-an-llm-inference-server-from-scratch";
const image = cover;
const tags = [
  "LLM",
  "LLM Inference",
  "LLM Serving",
  "KV Cache",
  "Continuous Batching",
  "vLLM",
  "PagedAttention",
  "PyTorch",
  "Machine Learning",
];

const date = "2026-11-28";
const readTime = 18;

const InferenceFromScratchBlog = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime,
);

export default InferenceFromScratchBlog;
