import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Post.module.css";
import blogs from "../../data/blogs";

export default function Post() {
  const { slug } = useParams();
  const [scroll, setScroll] = useState(0);

  const blog = useMemo(() => blogs.find((b) => b.slug === slug), [slug]);

  const similar = useMemo(() => {
    if (!blog) return [];
    return blogs
      .filter((b) => b.slug !== blog.slug)
      .map((b) => ({
        ...b,
        overlap: b.tags.filter((t) => blog.tags.includes(t)).length,
      }))
      .filter((b) => b.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 3);
  }, [blog]);

  useEffect(() => {
    if (blog) document.title = `${blog.title} — Shrirang Mahajan`;
    else document.title = "Post not found — Shrirang Mahajan";

    const onScroll = () => {
      const h = document.documentElement;
      const pct =
        (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100;
      setScroll(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [blog]);

  if (!blog) {
    return (
      <article className={styles.notFound}>
        <p className={styles.notFoundKicker}>404</p>
        <h1 className={styles.notFoundTitle}>
          That post <em>doesn't exist.</em>
        </h1>
        <Link to="/blogs" className={styles.notFoundLink}>
          ← Back to all posts
        </Link>
      </article>
    );
  }

  const d = new Date(blog.date);

  return (
    <article className={styles.article}>
      <div className={styles.progress} aria-hidden="true">
        <div className={styles.progressBar} style={{ width: `${scroll}%` }} />
      </div>

      <header className={styles.head}>
        <div className={styles.breadcrumbs}>
          <Link to="/blogs" className={styles.crumb}>
            ← Writing
          </Link>
        </div>

        <div className={styles.dateLine}>
          <span>
            {d.toLocaleDateString("en", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className={styles.dot}>·</span>
          <span>{blog.readTime} min read</span>
        </div>

        <h1 className={styles.title}>{blog.title}</h1>

        <div className={styles.tags}>
          {blog.tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </header>

      {blog.image && (
        <figure className={styles.cover}>
          <img src={blog.image} alt={blog.title} />
        </figure>
      )}

      <div className={styles.content}>{blog.content}</div>

      <hr className={styles.sep} />

      <div className={styles.share}>
        <p className={styles.shareLabel}>
          <em>If this resonated, pass it along.</em>
        </p>
        <div className={styles.shareLinks}>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `Reading "${blog.title}" by @notshrirang`
            )}&url=${encodeURIComponent(window.location.href)}`}
          >
            Share on X →
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              window.location.href
            )}`}
          >
            Share on LinkedIn →
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
              window.location.href
            )}&t=${encodeURIComponent(blog.title)}`}
          >
            Submit to HN →
          </a>
        </div>
      </div>

      {similar.length > 0 && (
        <aside className={styles.related}>
          <div className={styles.relatedLabel}>Related Reading</div>
          <ul className={styles.relatedList}>
            {similar.map((b) => (
              <li key={b.slug}>
                <Link to={`/blogs/${b.slug}`} className={styles.relatedLink}>
                  <span className={styles.relatedTitle}>{b.title}</span>
                  <span className={styles.relatedArr} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className={styles.footnote}>
        All content licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noreferrer noopener"
        >
          CC BY-SA 4.0
        </a>{" "}
        unless otherwise noted.
      </div>
    </article>
  );
}
