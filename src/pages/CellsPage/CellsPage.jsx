import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CellsPage.module.css";
import Cell from "../../components/Cell/Cell";
import { fetchPinnedRepos } from "../../data/projects";
import { fetchExperience } from "../../data/experiences.js";
import { fetchLanguageAnalysis } from "../../data/analysis.js";
import MarkdownCell from "../../components/MarkdownCell/MarkdownCell.jsx";
import skills from "../../data/skills.js";

const CellsPage = () => {
  const [activeCell, setActiveCell] = useState(1);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [languageData, setLanguageData] = useState(null);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);

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
                    flexDirection: window.innerWidth > 600 ? "row" : "column",
                    alignItems:
                      window.innerWidth > 600 ? "space-between" : "center",
                    justifyContent:
                      window.innerWidth > 600 ? "center" : "space-between",
                    width: "100%",
                  }}
                >
                  <div className={styles.markdownTitle}>Shrirang Mahajan</div>
                  <div className={styles.markdownHyperlinkRow}>
                    <a
                      href="https://x.com/notshrirang"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src={`https://img.icons8.com/?size=30&id=fJp7hepMryiw&format=png&color=${
                          theme == "dark" ? "ffffff" : "000000"
                        }`}
                        alt="X"
                      />
                    </a>
                    <a
                      href="https://huggingface.co/NotShrirang"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src={`https://img.icons8.com/?size=30&id=sop9ROXku5bb&format=png&color=${
                          theme == "dark" ? "ffffff" : "000000"
                        }`}
                        alt="Hugging Face"
                      />
                    </a>
                    <a
                      href="https://www.kaggle.com/notshrirang"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src={`https://img.icons8.com/?size=20&id=QrYhwpUzAcoy&format=png&color=${
                          theme == "dark" ? "ffffff" : "000000"
                        }`}
                        alt="Kaggle"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/shrirang-mahajan"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src={`https://img.icons8.com/?size=30&id=13930&format=png&color=${
                          theme == "dark" ? "ffffff" : "000000"
                        }`}
                        alt="LinkedIn"
                      />
                    </a>
                    <a
                      href="https://www.github.com/NotShrirang"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src={`https://img.icons8.com/?size=30&id=106564&format=png&color=${
                          theme == "dark" ? "ffffff" : "000000"
                        }`}
                        alt="GitHub"
                      />
                    </a>
                    <a
                      href="mailto:shrirangmahajan123@gmail.com"
                      className={styles.markdownHyperlink}
                    >
                      <img
                        src={`https://img.icons8.com/?size=30&id=12580&format=png&color=${
                          theme == "dark" ? "ffffff" : "000000"
                        }`}
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
                <div className={styles.markdownSkills}>
                  <div className={styles.markdownSkillsTitle}>Skills:</div>
                  <div className={styles.markdownSkillsList}>
                    {skills.map((skill) => (
                      <div
                        key={skill.name}
                        className={styles.markdownSkill}
                        onClick={() => {
                          window.open(
                            `https://github.com/NotShrirang?tab=repositories&q=&type=&language=` +
                              skill.language,
                            "_blank"
                          );
                        }}
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
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
                <span style={{ color: "#29B6E0" }}>import</span> portfolio
                <br />
                <br />
                <span style={{ color: "#479AFF" }}>projects</span> = portfolio.
                <span style={{ color: "#29B6E0" }}>get_projects</span>().
                <span style={{ color: "#29B6E0" }}>sample</span>(
                <span style={{ color: "#29B6E0" }}>6</span>)
                <br />
                print(<span style={{ color: "#479AFF" }}>projects</span>)
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
                            <div className={styles.projectLang} key={lang.name}>
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
                    navigate("/projects");
                  }}
                >
                  <div className={styles.projectFooterLink}>
                    View More Projects
                  </div>
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
                <span style={{ color: "#479AFF" }}>experience</span> =
                portfolio.
                <span style={{ color: "#29B6E0" }}>get_experience</span>()
                <br />
                print(<span style={{ color: "#479AFF" }}>experience</span>)
              </span>
            ),
            output: (
              <div className={styles.experienceContainerTitle}>
                My Experience:
                <div className={styles.experienceContainer}>
                  {experiences.map((experience) => {
                    return (
                      <div
                        className={styles.experienceCard}
                        key={experience.title}
                      >
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
                            <div key={point}>• {point}</div>
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
                <span style={{ color: "#479AFF" }}>languages</span> = portfolio.
                <span style={{ color: "#29B6E0" }}>get_languages</span>()
                <br />
                <span style={{ color: "#29B6E0" }}>plot</span>(
                <span style={{ color: "#479AFF" }}>languages</span>)
              </span>
            ),
            output: (
              <div className={styles.languageContainerTitle}>
                Languages I use:
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
                        key={language}
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
                <span style={{ color: "#479AFF" }}>education</span> = portfolio.
                <span style={{ color: "#29B6E0" }}>get_education</span>()
                <br />
                print(<span style={{ color: "#479AFF" }}>education</span>)
              </span>
            ),
            output: (
              <div className={styles.simpleTextOutput}>
                I have Bachlor's Degree in Computer Engineering (Minor: Data
                Science) from Pune University. ❤️
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
