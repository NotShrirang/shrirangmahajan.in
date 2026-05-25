import React, { useEffect, useState, useMemo } from "react";
import styles from "./Projects.module.css";
import { projects } from "../../data/projects";

const domains = ["All", "ML", "Web", "Mobile"];

export default function Projects() {
  const [domain, setDomain] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Work — Shrirang Mahajan";
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (domain !== "All" && p.domain !== domain) return false;
      if (!q) return true;
      const hay = [p.title, ...(p.tags || []), p.domain]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [domain, query]);

  return (
    <article className={styles.article}>
      <header className={styles.head}>
        <div className={styles.kicker}>
          <span>01</span>
          <span className={styles.kickerRule} />
          <span>Work</span>
        </div>
        <h1 className={styles.title}>
          Things <em>I've built.</em>
        </h1>
        <p className={styles.lede}>
          A complete index of projects — from tensor libraries with custom CUDA
          kernels to AI agents and fault-tolerant receipt parsers. Most are
          open-source.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.filters}>
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              className={`${styles.chip} ${
                domain === d ? styles.chipActive : ""
              }`}
              onClick={() => setDomain(d)}
            >
              {d}
              {d !== "All" && (
                <span className={styles.chipCount}>
                  {projects.filter((p) => p.domain === d).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Filter by tag, name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.count}>
        Showing <strong>{filtered.length}</strong> of {projects.length}
      </div>

      <ol className={styles.list}>
        {filtered.map((p, i) => (
          <li key={p.title} className={styles.item}>
            <a
              href={p.link || "#"}
              target={p.link ? "_blank" : undefined}
              rel="noreferrer noopener"
              className={styles.link}
            >
              <div className={styles.index}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h2 className={styles.itemTitle}>{p.title}</h2>
                  <span className={styles.domain}>{p.domain}</span>
                </div>
                <div className={styles.desc}>{p.description}</div>
                <div className={styles.tags}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {p.image && (
                <div className={styles.thumb}>
                  <img src={p.image} alt={p.title} loading="lazy" />
                </div>
              )}
            </a>
          </li>
        ))}
      </ol>

      {filtered.length === 0 && (
        <p className={styles.empty}>
          Nothing matches that. Try a different tag.
        </p>
      )}
    </article>
  );
}
