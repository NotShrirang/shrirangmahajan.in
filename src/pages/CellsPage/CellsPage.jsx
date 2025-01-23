import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

import styles from "./CellsPage.module.css";
import Cell from "../../components/Cell/Cell";
import { fetchPinnedRepos } from "../../data/projects.js";
import { fetchExperience } from "../../data/experiences.js";
import { fetchLanguageAnalysis } from "../../data/analysis.js";
import MarkdownCell from "../../components/MarkdownCell/MarkdownCell.jsx";

const CellsPage = () => {
  const [activeCell, setActiveCell] = useState(1);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [languageData, setLanguageData] = useState([]);

  useEffect(() => {
    fetchPinnedRepos("NotShrirang").then((data) => {
      console.log(data);
      setProjects(data);
    });

    fetchLanguageAnalysis("NotShrirang").then((data) => {
      console.log(data);
      const labels = data.map((lang) => lang[0]);
      const percentages = data.map((lang) => parseFloat(lang[1]));
      const displayData = [
        {
          values: percentages,
          labels: labels,
          type: "pie",
          textinfo: "percent",
          hoverinfo: "label+percent",
          textposition: "inside",
          marker: {
            colors: [
              "#1f77b4", // Customize colors
              "#ff7f0e",
              "#2ca02c",
              "#d62728",
              "#9467bd",
              "#8c564b",
              "#e377c2",
              "#7f7f7f",
              "#bcbd22",
              "#17becf",
            ],
          },
        },
      ];

      const layout = {
        title: `Most Used Languages by Shrirang Mahajan`,
        xaxis: {
          title: "Languages",
        },
        yaxis: {
          title: "Percentage (%)",
        },
      };

      setLanguageData({ displayData, layout });
    });

    const experience = fetchExperience();
    setExperiences(experience);
  }, []);

  return (
    <div className={styles.cellsPage}>
      <div className={styles.cellsContainer}>
        <MarkdownCell
          cell={{
            id: 1,
            output: (
              <div className={styles.markdownContainer}>
                <div className={styles.markdownTitle}>Shrirang Mahajan</div>
                <div className={styles.markdownHyperlinkRow}>
                  <a
                    href="https://www.linkedin.com/in/shrirang-mahajan"
                    className={styles.markdownHyperlink}
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://www.github.com/NotShrirang"
                    className={styles.markdownHyperlink}
                  >
                    GitHub
                  </a>
                  <a
                    href="mailto:shrirangmahajan123@gmail.com"
                    className={styles.markdownHyperlink}
                  >
                    Email
                  </a>
                </div>
                <div className={styles.markdownQuote}>
                  "In search of Global Maximum"
                </div>
              </div>
            ),
          }}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
        <Cell
          cell={{
            id: 2,
            content: (
              <span>
                <span style={{ color: "#AA22FF" }}>import</span> portfolio
                <br />
                <br />
                projects = portfolio.
                <span style={{ color: "#2196F3" }}>get_projects()</span>
                <br />
                print(projects)
              </span>
            ),
            output: (
              <div className={styles.projectContainerTitle}>
                My projects:
                <div className={styles.projectsContainer}>
                  {projects.map((project) => {
                    const name = project.name.replace(/-/g, " ");
                    return (
                      <div
                        key={name}
                        className={styles.projectCard}
                        onClick={() => window.open(project.url, "_blank")}
                      >
                        <a href={project.url} className={styles.projectLink}>
                          <h2 className={styles.projectName}>{name}</h2>
                        </a>
                        <div className={styles.projectDescription}>
                          {project.description}
                        </div>
                        <div className={styles.projectLanguages}>
                          {project.languages.nodes.map((lang) => (
                            <div className={styles.projectLang}>
                              {lang.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className={styles.projectFooter}
                  onClick={() => {
                    window.open(
                      "https://github.com/NotShrirang?tab=repositories",
                      "_blank"
                    );
                  }}
                >
                  <a
                    href="https://github.com/NotShrirang?tab=repositories"
                    className={styles.projectFooterLink}
                  >
                    View More Projects
                  </a>
                </div>
              </div>
            ),
          }}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
        <Cell
          cell={{
            id: 3,
            content: (
              <span>
                experiences = portfolio.
                <span style={{ color: "#2196F3" }}>get_experience()</span>
                <br />
                print(experiences)
              </span>
            ),
            output: (
              <div className={styles.projectContainerTitle}>
                My Experience:
                <div className={styles.experienceContainer}>
                  {experiences.map((experience) => {
                    return (
                      <div className={styles.experienceCard}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div className={styles.experienceName}>
                            {experience.title}
                          </div>
                          <div className={styles.experienceDuration}>
                            {experience.duration}
                          </div>
                        </div>
                        <div className={styles.experienceCompany}>
                          {experience.company}
                        </div>
                        <div className={styles.experienceDescription}>
                          {experience.description.map((point) => (
                            <div>• {point}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          }}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
        <Cell
          cell={{
            id: 4,
            content: (
              <span>
                langauages = portfolio.
                <span style={{ color: "#2196F3" }}>get_langauages()</span>
                <br />
                plot(langauages)
              </span>
            ),
            output: (
              <div className={styles.languageContainerTitle}>
                My language analysis:
                {languageData && (
                  <Plot
                    data={languageData.displayData}
                    layout={languageData.layout}
                  />
                )}
              </div>
            ),
          }}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
        <Cell
          cell={{
            id: 5,
            content: (
              <span>
                education = portfolio.
                <span style={{ color: "#2196F3" }}>get_education()</span>
                <br />
                print(education)
              </span>
            ),
            output: (
              <div className={styles.educationContainerTitle}>
                I am a Computer Engineer from Pune, India. ❤️
              </div>
            ),
          }}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
      </div>
    </div>
  );
};

export default CellsPage;
