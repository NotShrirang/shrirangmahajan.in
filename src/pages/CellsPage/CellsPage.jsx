import React, { useState, useEffect } from "react";

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
  const [languageData, setLanguageData] = useState(null);

  useEffect(() => {
    const username = "NotShrirang";
    fetchPinnedRepos(username).then((data) => {
      setProjects(data);
    });

    fetchLanguageAnalysis(username).then((data) => {
      setLanguageData(data);
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "space-between",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div className={styles.markdownTitle}>Shrirang Mahajan</div>
                  <div className={styles.markdownHyperlinkRow}>
                    <a
                      href="https://huggingface.co/NotShrirang"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src="https://img.icons8.com/?size=30&id=sop9ROXku5bb&format=png&color=000000"
                        alt="Hugging Face"
                      />
                    </a>
                    <a
                      href="https://www.kaggle.com/notshrirang"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src="https://img.icons8.com/?size=20&id=QrYhwpUzAcoy&format=png&color=000000"
                        alt="Kaggle"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/shrirang-mahajan"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src="https://img.icons8.com/?size=30&id=13930&format=png&color=000000"
                        alt="LinkedIn"
                      />
                    </a>
                    <a
                      href="https://www.github.com/NotShrirang"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src="https://img.icons8.com/?size=30&id=106564&format=png&color=ffffff"
                        alt="GitHub"
                      />
                    </a>
                    <a
                      href="mailto:shrirangmahajan123@gmail.com"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src="https://img.icons8.com/?size=30&id=12580&format=png&color=ffffff"
                        alt="Email"
                      />
                    </a>
                  </div>
                </div>
                <div className={styles.markdownQuote}>
                  "In search of Global Maximum..."
                </div>
                <div className={styles.markdownDescription}>
                  I am a Computer Engineer from Pune, India. I am passionate
                  about building AI products and solving real-world problems. I
                  have experience in building scalable and robust software
                  systems. I am always eager to learn new technologies and work
                  on challenging projects.
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
              <div className={styles.experienceContainerTitle}>
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
                <div className={styles.languageTable}>
                  {languageData &&
                    Object.keys(languageData).map((language) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div className={styles.languageName}>
                          {languageData[language][0]}
                        </div>
                        <div className={styles.languagePercentage}>
                          {languageData[language][1]}%
                        </div>
                      </div>
                    ))}
                </div>
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
              <div style={{ paddingLeft: "0.5rem", paddingTop: "0.5rem" }}>
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
