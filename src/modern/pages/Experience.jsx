import React, { useEffect } from "react";
import styles from "./Experience.module.css";
import { fetchExperience } from "../../data/experiences";

function durationToYears(d) {
  const m = d.match(/(\w+ \d{4}) - (.+)/);
  if (!m) return { startMonth: "", startYear: "", endMonth: "", endYear: "" };
  const [, start, end] = m;
  const [startMonth, startYear] = start.split(" ");
  const isPresent = /present/i.test(end);
  const [endMonth, endYear] = isPresent ? ["", "Now"] : end.split(" ");
  return { startMonth, startYear, endMonth, endYear };
}

export default function Experience() {
  useEffect(() => {
    document.title = "Experience — Shrirang Mahajan";
  }, []);
  const experiences = fetchExperience();

  return (
    <article className={styles.article}>
      <header className={styles.head}>
        <div className={styles.kicker}>
          <span>03</span>
          <span className={styles.kickerRule} />
          <span>Experience</span>
        </div>
        <h1 className={styles.title}>
          A short <em>résumé.</em>
        </h1>
        <p className={styles.lede}>
          Four roles, four years, one obsession: shipping production ML systems
          that work outside the notebook.
        </p>
      </header>

      <ol className={styles.timeline}>
        {experiences.map((e, i) => {
          const { startMonth, startYear, endMonth, endYear } = durationToYears(
            e.duration
          );
          return (
            <li key={e.id} className={styles.row}>
              <aside className={styles.gutter}>
                <div className={styles.gutterPin} aria-hidden="true">
                  <span />
                </div>
                <div className={styles.gutterDates}>
                  <div className={styles.year}>{endYear}</div>
                  <div className={styles.month}>{endMonth}</div>
                  <div className={styles.bar} aria-hidden="true" />
                  <div className={styles.year}>{startYear}</div>
                  <div className={styles.month}>{startMonth}</div>
                </div>
              </aside>

              <div className={styles.body}>
                <h2 className={styles.role}>{e.title}</h2>
                <a
                  href={e.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.company}
                >
                  {e.company}
                  <span aria-hidden="true">›</span>
                </a>
                <ul className={styles.bullets}>
                  {e.description.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className={styles.footer}>
        <p>
          Want the <em>formal</em> version?{" "}
          <a
            href="https://drive.google.com/file/d/1gex06Ruc1n8Pwlihg14v8NdQj26uaSck/view"
            target="_blank"
            rel="noreferrer noopener"
            className={styles.resumeLink}
          >
            Download résumé (PDF) ›
          </a>
        </p>
      </footer>
    </article>
  );
}
