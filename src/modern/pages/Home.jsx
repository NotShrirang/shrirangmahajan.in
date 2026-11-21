import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import blogs from "../../data/blogs";
import { projects } from "../../data/projects";
import { fetchExperience } from "../../data/experiences";
import publications from "../../data/publications";
import { education, RESUME_URL } from "../../data/profile";
import ChatPanel from "../components/ChatPanel";
import LiveDemo from "../components/LiveDemo";

const featuredProjectTitles = ["LLM Serving Engine", "Tensorax", "TinyGPT", "Kiosk"];

// Hand-picked rather than "most recent", so the homepage shows the posts
// closest to systems and training work.
const featuredPostSlugs = [
  "pretraining-95m-llm-consumer-gpu",
  "writing-cuda-kernels-from-scratch-a-beginner's-guide",
  "attention-and-the-versions-of-it-layer-by-layer",
  "llama-2-explained",
];

// Three Skylark Labs highlights for the homepage. The full list lives in
// data/experiences.jsx and is shown on /experience.
const skylarkHighlights = [
  {
    title: "Kepler: video analytics at scale",
    text: (
      <>
        Built the entire stack of the CCTV and drone analytics (fire and smoke, PPE, ANPR,
        weapons, intrusion, crowd counting, face recognition), served over gRPC
        on Triton, Jetson, ONNX and CPU. Scales from{" "}
        <b>4 cameras on a Jetson AGX Orin to 40 on an A5000 cluster</b> at{" "}
        <b>400 ms P99</b>.
      </>
    ),
    tags: ["NVIDIA Triton", "TensorRT", "Jetson", "gRPC"],
  },
  {
    title: "Aircraft tracking at a live airfield",
    text: (
      <>
        Owned end to end as the sole engineer. Tracked{" "}
        <b>1,400+ takeoffs and landings</b> with the aircraft{" "}
        <b>in frame 90%</b> of the time at <b>23 FPS</b> (up from 14 with TensorRT FP16 and threaded rendering), using YOLO, visual
        odometry, SIFT/RANSAC pose correction and predictive PTZ control.
      </>
    ),
    tags: ["YOLO", "Visual Odometry", "PTZ Control"],
  },
  {
    title: "Inference performance on the edge",
    text: (
      <>
        A TensorRT gRPC inference server on Jetson AGX Orin, cutting per-frame
        time <b>2.7× (65 → 24 ms)</b>, mostly by rewriting preprocessing.
        Elsewhere, <b>doubled throughput</b> with TensorRT on Triton and cut
        retrieval latency <b>88% (971 → 113 ms)</b>.
      </>
    ),
    tags: ["TensorRT", "Jetson AGX Orin", "Qdrant"],
  },
];

function durationToYears(d) {
  const m = d.match(/(\w+ \d{4}) - (.+)/);
  if (!m) return { start: "", end: "" };
  const [, start, end] = m;
  const startYear = start.match(/\d{4}/)?.[0] ?? "";
  const endYear = /present/i.test(end) ? "Now" : end.match(/\d{4}/)?.[0] ?? "";
  return { start: startYear, end: endYear };
}

/* Causal attention — 16×16 minimalist animation. No labels, no chrome.
   Cells light up row by row (decoding order), with a tiny left-to-right
   stagger within each row so the wave reads as a real query-by-query
   scan rather than a diagonal sweep. */
function CausalAttentionViz({ size = 16 }) {
  const cycle = 4800;
  const rowSlot = cycle / size; // 300ms per row at 4.8s / 16
  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (c > r) {
        cells.push(<div key={`${r}-${c}`} className={styles.causalCell} />);
        continue;
      }
      const intensity = Math.max(0.45, 1 - (r - c) / (size - 1));
      // Row-major: each row fires together, cells inside it ripple left→right.
      const delay = r * rowSlot + c * 10;
      cells.push(
        <div
          key={`${r}-${c}`}
          className={`${styles.causalCell} ${styles.causalCellActive}`}
          style={{
            "--cellIntensity": intensity,
            // Custom properties, not animationDelay/Duration: the animation
            // runs on the cell's ::after overlay (see Home.module.css), and
            // only custom properties inherit into a pseudo-element.
            "--cellDelay": `${delay}ms`,
            "--cellDuration": `${cycle}ms`,
          }}
        />
      );
    }
  }
  return (
    <div
      className={styles.causalGrid}
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {cells}
    </div>
  );
}

const HERO_CAPTION = "Causal attention";

export default function Home() {
  useEffect(() => {
    document.title = "Shrirang Mahajan — Machine Learning & LLM Engineer";
  }, []);

  const featured = featuredProjectTitles
    .map((t) => projects.find((p) => p.title === t))
    .filter(Boolean);

  const featuredPosts = featuredPostSlugs
    .map((s) => blogs.find((b) => b.slug === s))
    .filter(Boolean);
  const experiences = fetchExperience();

  return (
    <article className={styles.article}>
      {/* ─────────────────────────  HERO  ───────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>
            Machine Learning Engineer
            <span className={styles.kickerDot}>·</span>
            Pune, India
          </p>

          <h1 className={styles.title}>
            Shrirang <em>Mahajan</em>
            <sup className={styles.star} title="in search of global maximum">
              *
            </sup>
          </h1>

          <p className={styles.lede}>
            I work on ML systems: making models train and run fast on the
            hardware you actually have. I write GPU kernels, build inference
            servers, pretrain small LLMs, and ship computer vision to
            production, from Jetson edge devices to multi-GPU clusters.
          </p>

          <p className={styles.currently}>
            Currently Machine Learning Engineer II at{" "}
            <a
              href="https://skylarklabs.ai/"
              target="_blank"
              rel="noreferrer noopener"
              className={styles.currentlyLink}
            >
              Skylark Labs
            </a>
            , where I'm the sole ML engineer. Co-author of{" "}
            <a
              href={publications[0].link}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.currentlyLink}
            >
              CFAMs
            </a>{" "}
            (arXiv, 2026).
          </p>

          <div className={styles.cta}>
            <a href="#research" className={styles.ctaPrimary}>
              <span className={styles.ctaLabel}>See my work</span>
              <span className={styles.ctaArr} aria-hidden="true">
                ›
              </span>
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.ctaSecondary}
            >
              CV (PDF)
            </a>
            <Link to="/contact" className={styles.ctaSecondary}>
              Get in touch
            </Link>
          </div>
        </div>

        <aside className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroVisualFrame}>
            <CausalAttentionViz size={20} />
          </div>
          <div className={styles.attnCaption}>
            <span><sup>*</sup><em>{HERO_CAPTION}</em></span>
          </div>
        </aside>

        <a
          href="#research"
          className={styles.heroScroll}
          aria-label="Scroll to next section"
        >
          <svg
            className={styles.heroScrollArrow}
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>
      </header>

      {/* ─────────────────────────  RESEARCH  ───────────────────────── */}
      <section id="research" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>01</span>
            <span className={styles.sectionLabelText}>Research</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Models that keep <em>learning after deployment.</em>
          </h2>
        </div>

        <ol className={styles.workList}>
          {publications.map((p) => (
            <li key={p.id} className={styles.workItem}>
              <div className={styles.workLink}>
                <div className={styles.workIndex}>
                  <span>{p.year}</span>
                </div>
                <div className={styles.workBody}>
                  <h3 className={styles.workTitle}>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={styles.workTitleLink}
                    >
                      {p.title}
                    </a>
                  </h3>
                  <div className={styles.workDesc}>
                    <ul>
                      {p.description.map((d, j) => (
                        <li key={j}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.workTags}>
                    <span className={styles.tag}>{p.venue}</span>
                    <span className={styles.tag}>{p.role}</span>
                    <span className={styles.tag}>Continual Learning</span>
                  </div>
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.workArrow}
                  aria-label={`Open ${p.title}`}
                >
                  ›
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ─────────────────────────  AT SKYLARK  ───────────────────────── */}
      <section id="industry" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>02</span>
            <span className={styles.sectionLabelText}>At Skylark Labs</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Computer vision <em>in production.</em>
          </h2>
          <p className={styles.sectionLede}>
            As the sole ML engineer on a small team, I build and deploy the
            models, and make them fast enough to run on the hardware we have.
          </p>
        </div>

        <ol className={styles.workList}>
          {skylarkHighlights.map((h, i) => (
            <li key={h.title} className={styles.workItem}>
              <div className={styles.workLink}>
                <div className={styles.workIndex}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.workBody}>
                  <h3 className={styles.workTitle}>{h.title}</h3>
                  <div className={styles.workDesc}>{h.text}</div>
                  <div className={styles.workTags}>
                    {h.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <Link to="/experience" className={styles.sectionMore}>
          Full work history <span aria-hidden="true">›</span>
        </Link>
      </section>

      {/* ─────────────────────  SELECTED WORK  ───────────────────── */}
      <section id="work" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>03</span>
            <span className={styles.sectionLabelText}>Selected Projects</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Built from scratch, <em>then measured.</em>
          </h2>
          <p className={styles.sectionLede}>
            Side projects where I build the layer underneath myself, then
            benchmark it against the real thing: a serving engine against
            vLLM, an attention kernel against cuDNN.
          </p>
        </div>

        <ol className={styles.workList}>
          {featured.map((p, i) => (
            <li key={p.title} className={styles.workItem}>
              <div className={styles.workLink}>
                <div className={styles.workIndex}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.workBody}>
                  <h3 className={styles.workTitle}>
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={styles.workTitleLink}
                      >
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <div className={styles.workDesc}>
                    {p.summary ?? p.description}
                  </div>
                  <div className={styles.workTags}>
                    {p.tags.slice(0, 5).map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.workArrow}
                    aria-label={`Open ${p.title}`}
                  >
                    ›
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>

        <Link to="/projects" className={styles.sectionMore}>
          View all {projects.length} projects{" "}
          <span aria-hidden="true">›</span>
        </Link>
      </section>

      {/* ─────────────────────────  LIVE DEMO  ───────────────────────── */}
      <section id="demo" className={styles.section}>
        <div className={styles.demoTop}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.sectionNum}>04</span>
              <span className={styles.sectionLabelText}>
                TinyGPT{" "}
                <span className={styles.sectionLabelTag}>· my model · local</span>
              </span>
            </div>
            <h2 className={styles.sectionTitle}>
              My 95M-parameter LLM, <em>running on your device.</em>
            </h2>
            <p className={styles.sectionLede}>
              The model I pretrained from scratch on{" "}
              <strong>2.1B tokens of OpenWebText</strong> using a single RTX
              3070 Ti, then instruction-tuned on Stanford Alpaca. Click to
              download the ONNX weights (~536 MB) — inference then runs
              locally via WebGPU (or WASM fallback). Fluent English, often
              wrong facts — it's small.
            </p>
          </div>

          <aside className={styles.demoSpec} aria-label="Model spec">
            <div className={styles.demoSpecHeader}>
              <span className={styles.demoSpecKicker}>Model spec</span>
              <Link to="/tinygpt" className={styles.demoSpecLink}>
                full breakdown <span aria-hidden="true">›</span>
              </Link>
            </div>
            <dl className={styles.demoSpecList}>
              {[
                ["Parameters", "95M"],
                ["Layers", "12 · 768 dim"],
                ["Attention", "GQA · 12Q / 4KV"],
                ["Positional", "RoPE + RMSNorm"],
                ["Vocab", "50,257 (GPT-2 BPE)"],
                ["Context", "512 tokens"],
                ["Pretrain", "2.1B tokens · OpenWebText"],
                ["Hardware", "1× RTX 3070 Ti (8 GB)"],
                ["SFT", "Stanford Alpaca · 52K"],
              ].map(([k, v]) => (
                <div key={k} className={styles.demoSpecRow}>
                  <dt className={styles.demoSpecKey}>{k}</dt>
                  <dd className={styles.demoSpecVal}>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
        <LiveDemo />
      </section>

      {/* ───────────────────────  WRITING  ─────────────────────── */}
      <section id="writing" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>05</span>
            <span className={styles.sectionLabelText}>Writing</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Essays, with <em>illustrations.</em>
          </h2>
          <p className={styles.sectionLede}>
            Long-form posts on pre-training LLMs on consumer hardware, writing
            CUDA kernels, and how attention works inside.
          </p>
        </div>

        <ul className={styles.postList}>
          {featuredPosts.map((b) => {
            const d = new Date(b.date);
            return (
              <li key={b.slug} className={styles.postItem}>
                <Link to={`/blogs/${b.slug}`} className={styles.postLink}>
                  <div className={styles.postDate}>
                    <span>{d.toLocaleString("en", { month: "short" })}</span>
                    <span>{d.getFullYear()}</span>
                  </div>
                  <div className={styles.postBody}>
                    <h3 className={styles.postTitle}>{b.title}</h3>
                    <div className={styles.postMeta}>
                      <span>{b.readTime} min read</span>
                      <span className={styles.metaDot}>·</span>
                      <span>{b.tags.slice(0, 3).join(" · ")}</span>
                    </div>
                  </div>
                  <div className={styles.postArrow} aria-hidden="true">
                    ›
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link to="/blogs" className={styles.sectionMore}>
          All {blogs.length} posts <span aria-hidden="true">›</span>
        </Link>
      </section>

      {/* ───────────────────────  EXPERIENCE  ─────────────────────── */}
      <section id="experience" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>06</span>
            <span className={styles.sectionLabelText}>
              Experience &amp; Education
            </span>
          </div>
          <h2 className={styles.sectionTitle}>
            A short <em>résumé.</em>
          </h2>
        </div>

        <div className={styles.expTable}>
          {experiences.map((e) => {
            const { start, end } = durationToYears(e.duration);
            return (
              <a
                href={e.link}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.expRow}
                key={e.id}
              >
                <div className={styles.expYear}>
                  <span>{start}</span>
                  <span className={styles.expDash}>—</span>
                  <span>{end}</span>
                </div>
                <div className={styles.expRole}>{e.title}</div>
                <div className={styles.expCompany}>
                  <span>{e.company}</span>
                  <span className={styles.expArr} aria-hidden="true">
                    ›
                  </span>
                </div>
              </a>
            );
          })}
          {education.map((ed) => (
            <a
              href={ed.link}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.expRow}
              key={`edu-${ed.id}`}
            >
              <div className={styles.expYear}>
                <span>{ed.grade}</span>
              </div>
              <div className={styles.expRole}>
                {ed.degree} ({ed.minor})
              </div>
              <div className={styles.expCompany}>
                <span>{ed.school}</span>
                <span className={styles.expArr} aria-hidden="true">
                  ›
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className={styles.cta}>
          <Link to="/experience" className={styles.sectionMore}>
            Full work history <span aria-hidden="true">›</span>
          </Link>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.sectionMore}
          >
            CV (PDF) <span aria-hidden="true">›</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────  APPROACH  ───────────────────────── */}
      <section id="approach" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>07</span>
            <span className={styles.sectionLabelText}>Approach</span>
          </div>
          <h2 className={styles.sectionTitle}>
            One layer deeper
            <br /> <em>than I strictly need.</em>
          </h2>
          <p className={styles.sectionLede}>
            Three habits I try to keep when I build ML systems.
          </p>
        </div>

        <ol className={styles.manifesto}>
          <li className={styles.belief}>
            <div className={styles.beliefNum} aria-hidden="true">
              I
            </div>
            <div className={styles.beliefBody}>
              <h3 className={styles.beliefTitle}>
                Build the layer <em>underneath, once.</em>
              </h3>
              <p className={styles.beliefText}>
                Most of the time I use models, libraries and servers that
                other people built, and that's how it should be. But I
                understand a tool best after I've built a small version of
                what's under it.{" "}
                <a
                  href="https://github.com/NotShrirang/tinygpt"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>TinyGPT</strong>
                </a>{" "}
                taught me what pretraining costs on 8 GB of VRAM. When I wanted
                to know what happens under <code>.cuda()</code>, I wrote{" "}
                <a
                  href="https://pypi.org/project/tensorax/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>Tensorax</strong>
                </a>
                . When I wanted to know why vLLM is fast, I built a serving
                engine without its tricks and measured the difference.
              </p>
            </div>
          </li>

          <li className={styles.belief}>
            <div className={styles.beliefNum} aria-hidden="true">
              II
            </div>
            <div className={styles.beliefBody}>
              <h3 className={styles.beliefTitle}>
                Measure <em>against the real thing.</em>
              </h3>
              <p className={styles.beliefText}>
                A number with no baseline says very little. I compare my work
                against the strongest system I can find, such as cuDNN for my
                attention kernel and vLLM for my serving engine, and I report
                the gap even when it's 12×. Working out where the gap comes
                from is the part I learn the most from.
              </p>
            </div>
          </li>

          <li className={styles.belief}>
            <div className={styles.beliefNum} aria-hidden="true">
              III
            </div>
            <div className={styles.beliefBody}>
              <h3 className={styles.beliefTitle}>
                The <em>right</em> hard path.
              </h3>
              <p className={styles.beliefText}>
                I use AI to learn faster. I do not use it to write code I
                can't read. When I pretrained{" "}
                <a
                  href="https://github.com/NotShrirang/tinygpt"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>TinyGPT</strong>
                </a>{" "}
                on a single 8 GB GPU, I learned attention internals, mixed
                precision and gradient accumulation by working through them
                myself. A shortcut that skips the part where you get better
                isn't really a shortcut.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* ─────────────────────  SITE ASSISTANT (CHAT)  ────────────────── */}
      <section id="chat" className={styles.section}>
        <div className={styles.askTop}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.sectionNum}>08</span>
              <span className={styles.sectionLabelText}>
                Site Assistant{" "}
                <span className={styles.sectionLabelTag}>
                  · grounded · navigates
                </span>
              </span>
            </div>
            <h2 className={styles.sectionTitle}>
              Ask <em>about</em> this site.
            </h2>
            <p className={styles.sectionLede}>
              A hosted LLM grounded in this site's content — every project,
              role, blog post, and skill on this page is in its context. It can
              also fetch fresh GitHub data and send you to the right page when
              you ask for it. Much better informed about <em>me</em> than
              TinyGPT above — though, like any language model, still capable of
              getting things wrong.
            </p>
          </div>

          <aside className={styles.askSketch} aria-hidden="true">
            <div className={styles.askSketchCaption}>
              <span className={styles.askSketchKicker}>how it answers</span>
            </div>
            <svg
              className={styles.askSketchSvg}
              viewBox="0 0 320 420"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
            >
              <defs>
                <filter
                  id="askRough"
                  x="-5%"
                  y="-5%"
                  width="110%"
                  height="110%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.03"
                    numOctaves="2"
                    seed="7"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    scale="2.4"
                  />
                </filter>
                <marker
                  id="askArrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 0 1 L 9 5 L 0 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>

              {/* Stroke layer — gets the rough filter for hand-drawn feel */}
              <g
                className={styles.askInk}
                filter="url(#askRough)"
              >
                {/* You box */}
                <rect
                  x="100"
                  y="14"
                  width="120"
                  height="44"
                  rx="4"
                />
                <path d="M160 60 L160 88" markerEnd="url(#askArrow)" />

                {/* LLM box */}
                <rect
                  x="60"
                  y="92"
                  width="200"
                  height="78"
                  rx="6"
                />

                {/* Loop: LLM → tools (right side, curves out) */}
                <path d="M260 122 C 290 122, 296 170, 274 188" markerEnd="url(#askArrow)" />
                {/* Loop back: tools → LLM */}
                <path d="M274 226 C 296 244, 290 270, 260 252" markerEnd="url(#askArrow)" />

                {/* Tools box (small, to the right) */}
                <rect
                  x="218"
                  y="188"
                  width="84"
                  height="40"
                  rx="4"
                />

                {/* LLM → reply (down) */}
                <path d="M160 170 L160 250" markerEnd="url(#askArrow)" />

                {/* Reply box */}
                <rect
                  x="60"
                  y="254"
                  width="200"
                  height="60"
                  rx="6"
                />

                {/* Streaming wavy line under reply */}
                <path d="M82 336 q 12 -8 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0" />
              </g>

              {/* Text layer — crisp, NOT filtered, so labels read clean */}
              <g className={styles.askLabels}>
                <text x="160" y="40" textAnchor="middle" className={styles.askLabelSmall}>
                  YOUR QUESTION
                </text>

                <text x="160" y="124" textAnchor="middle" className={styles.askLabelBig}>
                  LLM
                </text>
                <text x="160" y="148" textAnchor="middle" className={styles.askLabelSub}>
                  grounded in this page
                </text>

                <text x="260" y="212" textAnchor="middle" className={styles.askLabelMid}>
                  tools
                </text>
                <text x="260" y="225" textAnchor="middle" className={styles.askLabelTiny}>
                  github · nav
                </text>

                <text x="160" y="284" textAnchor="middle" className={styles.askLabelBig}>
                  reply
                </text>
                <text x="160" y="304" textAnchor="middle" className={styles.askLabelSub}>
                  streamed back, with links
                </text>

                {/* Tiny annotations to add life */}
                <text x="312" y="148" textAnchor="end" className={styles.askLabelHand}>
                  if needed ↶
                </text>
                <text x="46" y="298" textAnchor="end" className={styles.askLabelHand}>
                  ~~
                </text>
              </g>
            </svg>
          </aside>
        </div>
        <ChatPanel />
      </section>

      {/* ─────────────────────  CLOSING NOTE  ─────────────────────── */}
      <section className={styles.closing}>
        <p className={styles.closingPara}>
          Thanks for scrolling. If something here resonated — a project, an
          essay, a problem you're trying to solve — I'd love to{" "}
          <Link to="/contact" className={styles.closingLink}>
            hear from you
          </Link>
          .
        </p>
        <p className={styles.closingSign}>— Shrirang</p>
      </section>
    </article>
  );
}
