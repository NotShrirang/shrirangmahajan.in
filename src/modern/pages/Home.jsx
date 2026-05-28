import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import blogs from "../../data/blogs";
import { projects } from "../../data/projects";
import { fetchExperience } from "../../data/experiences";
import ChatPanel from "../components/ChatPanel";
import LiveDemo from "../components/LiveDemo";

const featuredProjectTitles = ["Tensorax", "TinyGPT", "AgentFlow", "LoomRAG: A Multimodal RAG"];

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
            animationDelay: `${delay}ms`,
            animationDuration: `${cycle}ms`,
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
    document.title = "Shrirang Mahajan — Full-Stack AI Developer & ML Engineer";
  }, []);

  const featured = featuredProjectTitles
    .map((t) => projects.find((p) => p.title === t))
    .filter(Boolean);

  const recentPosts = blogs.slice(0, 4);
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
            I build the systems that build the systems — LLMs trained from
            scratch, CUDA kernels written by hand, and production ML that
            triples throughput.
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
            .
          </p>

          <div className={styles.cta}>
            <Link to="/projects" className={styles.ctaPrimary}>
              <span className={styles.ctaLabel}>See selected work</span>
              <span className={styles.ctaArr} aria-hidden="true">
                →
              </span>
            </Link>
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
      </header>

      {/* ─────────────────────────  APPROACH  ───────────────────────── */}
      <section id="approach" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>01</span>
            <span className={styles.sectionLabelText}>Approach</span>
          </div>
          <h2 className={styles.sectionTitle}>
            I'd rather write a <em>tensor library</em>
            <br /> than wrap an API.
          </h2>
          <p className={styles.sectionLede}>
            Three things I've come to believe about building AI systems —
            the kind of engineer I'm trying to be.
          </p>
        </div>

        <ol className={styles.manifesto}>
          <li className={styles.belief}>
            <div className={styles.beliefNum} aria-hidden="true">
              I
            </div>
            <div className={styles.beliefBody}>
              <h3 className={styles.beliefTitle}>
                Provider, <em>not consumer.</em>
              </h3>
              <p className={styles.beliefText}>
                Most "AI engineering" today means orchestrating APIs that
                someone else built — wrapping endpoints, chaining services,
                paying for inference. I want to be the someone else. The
                engineer who writes the kernels behind the matmul, the
                autograd behind the loss, the loader that makes a
                95M-parameter LLM trainable on 8 GB of VRAM.{" "}
                <a
                  href="https://pypi.org/project/tensorax/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>Tensorax</strong>
                </a>{" "}
                is on PyPI for exactly this reason: a tensor library written
                from scratch in C++ and CUDA — <em>no NumPy, no PyTorch, no
                cuBLAS underneath.</em>
              </p>
            </div>
          </li>

          <li className={styles.belief}>
            <div className={styles.beliefNum} aria-hidden="true">
              II
            </div>
            <div className={styles.beliefBody}>
              <h3 className={styles.beliefTitle}>
                Proof of work <em>over pedigree.</em>
              </h3>
              <p className={styles.beliefText}>
                A degree describes potential. Code describes what you've
                actually shipped. The bar I hold myself to is whether someone
                can <code>pip install</code> my work and have it run on their
                machine. Understanding the hardware — memory hierarchy, kernel
                execution, what actually happens when you call{" "}
                <code>.cuda()</code> — matters more than where I studied it.
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
                I use AI to learn systems faster. I do not use it to write
                code I can't read. When I built Tensorax's CUDA kernels, I
                sat with the GPU memory hierarchy until tiling, shared
                memory, and coalescing made sense. When I pretrained{" "}
                <a
                  href="https://github.com/NotShrirang/tinygpt"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>TinyGPT</strong>
                </a>{" "}
                on a single 8 GB GPU, I learned mixed precision and gradient
                accumulation by hand — not by autocomplete. A shortcut that
                skips the part where you become better isn't a shortcut.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* ─────────────────────  SELECTED WORK  ───────────────────── */}
      <section id="work" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>02</span>
            <span className={styles.sectionLabelText}>Selected Work</span>
          </div>
          <h2 className={styles.sectionTitle}>
            A few things <em>I've built</em> recently.
          </h2>
          <p className={styles.sectionLede}>
            From CUDA kernels you can <code>pip install</code> to LLMs you can
            train on a single 8 GB GPU. All open source.
          </p>
        </div>

        <ol className={styles.workList}>
          {featured.map((p, i) => (
            <li key={p.title} className={styles.workItem}>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.workLink}
              >
                <div className={styles.workIndex}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.workBody}>
                  <h3 className={styles.workTitle}>{p.title}</h3>
                  <div className={styles.workDesc}>{p.description}</div>
                  <div className={styles.workTags}>
                    {p.tags.slice(0, 5).map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.workArrow} aria-hidden="true">
                  →
                </div>
              </a>
            </li>
          ))}
        </ol>

        <Link to="/projects" className={styles.sectionMore}>
          View all {projects.length} projects{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ─────────────────────────  LIVE DEMO  ───────────────────────── */}
      <section id="demo" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>03</span>
            <span className={styles.sectionLabelText}>
              TinyGPT <span className={styles.sectionLabelTag}>· my model · local</span>
            </span>
          </div>
          <h2 className={styles.sectionTitle}>
            My 95M-parameter LLM, <em>running on your device.</em>
          </h2>
          <p className={styles.sectionLede}>
            The model I pretrained from scratch on{" "}
            <strong>~6.5B tokens of OpenWebText</strong> using a single RTX
            3070 Ti, then instruction-tuned on Stanford Alpaca. Click to
            download the ONNX weights (~536 MB) — inference then runs
            locally via WebGPU (or WASM fallback). Fluent English, often
            wrong facts — it's small.
          </p>
        </div>
        <LiveDemo />
      </section>

      {/* ───────────────────────  WRITING  ─────────────────────── */}
      <section id="writing" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>04</span>
            <span className={styles.sectionLabelText}>Writing</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Essays, with <em>illustrations.</em>
          </h2>
          <p className={styles.sectionLede}>
            Long-form posts on attention, embeddings, CUDA kernels, and
            pre-training LLMs on consumer hardware.
          </p>
        </div>

        <ul className={styles.postList}>
          {recentPosts.map((b) => {
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
                    →
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link to="/blogs" className={styles.sectionMore}>
          All {blogs.length} posts <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ───────────────────────  EXPERIENCE  ─────────────────────── */}
      <section id="experience" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>05</span>
            <span className={styles.sectionLabelText}>Experience</span>
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
                    ↗
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <Link to="/experience" className={styles.sectionMore}>
          Full work history <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ─────────────────────  SITE ASSISTANT (CHAT)  ────────────────── */}
      <section id="chat" className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>06</span>
            <span className={styles.sectionLabelText}>
              Site Assistant{" "}
              <span className={styles.sectionLabelTag}>· grounded · navigates</span>
            </span>
          </div>
          <h2 className={styles.sectionTitle}>
            Ask <em>about</em> this site.
          </h2>
          <p className={styles.sectionLede}>
            A production-grade LLM grounded in this site's content — every
            project, role, blog post, and skill on this page is in its
            context. It can also fetch fresh GitHub data and send you to
            the right page when you ask for it. Different from TinyGPT
            above: this one is factually reliable about <em>me.</em>
          </p>
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
