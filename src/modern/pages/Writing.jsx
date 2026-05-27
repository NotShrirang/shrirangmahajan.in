import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Writing.module.css";
import blogs from "../../data/blogs";

const TOP_TAG_LIMIT = 6;

export default function Writing() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    document.title = "Writing — Shrirang Mahajan";
  }, []);

  // Build tag → count, then sort by frequency. We show only the top N tags
  // by default and hide the rest behind a "+N more" toggle; the search
  // input handles the long-tail.
  const { topTags, restTags } = useMemo(() => {
    const counts = new Map();
    blogs.forEach((b) =>
      b.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1))
    );
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
    return {
      topTags: sorted.slice(0, TOP_TAG_LIMIT),
      restTags: sorted.slice(TOP_TAG_LIMIT),
    };
  }, []);

  const visibleTags = ["All", ...topTags, ...(showAllTags ? restTags : [])];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogs.filter((b) => {
      if (activeTag !== "All" && !b.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.tags.join(" ").toLowerCase().includes(q)
      );
    });
  }, [query, activeTag]);

  return (
    <article className={styles.article}>
      <header className={styles.head}>
        <div className={styles.kicker}>
          <span>02</span>
          <span className={styles.kickerRule} />
          <span>Writing</span>
        </div>
        <h1 className={styles.title}>
          Essays, with <em>illustrations.</em>
        </h1>
        <p className={styles.lede}>
          Notes on attention, embeddings, CUDA, and the everyday strangeness of
          training neural networks on a budget.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.tags}>
          {visibleTags.map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.chip} ${
                activeTag === t ? styles.chipActive : ""
              }`}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
          {restTags.length > 0 && (
            <button
              type="button"
              className={styles.chipMore}
              onClick={() => setShowAllTags((v) => !v)}
              aria-expanded={showAllTags}
            >
              {showAllTags ? "Less" : `+${restTags.length} more`}
            </button>
          )}
        </div>
        <div className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Search posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <ul className={styles.list}>
        {filtered.map((b, i) => {
          const d = new Date(b.date);
          return (
            <li key={b.slug} className={styles.item}>
              <Link to={`/blogs/${b.slug}`} className={styles.link}>
                <div className={styles.index}>
                  <span>{String(filtered.length - i).padStart(2, "0")}</span>
                </div>
                <div className={styles.body}>
                  <div className={styles.dateLine}>
                    <span>
                      {d.toLocaleDateString("en", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className={styles.dot}>·</span>
                    <span>{b.readTime} min read</span>
                  </div>
                  <h2 className={styles.itemTitle}>{b.title}</h2>
                  <div className={styles.itemTags}>
                    {b.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {b.image && (
                  <div className={styles.thumb}>
                    <img src={b.image} alt={b.title} loading="lazy" />
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className={styles.empty}>Nothing here. Try a different filter.</p>
      )}
    </article>
  );
}
