import React, { useEffect, useState } from "react";
import styles from "./ExperiencePage.module.css";
import MarkdownCell from "../../components/MarkdownCell/MarkdownCell";
import { fetchExperience } from "../../data/experiences";

const ExperiencePage = () => {
  const [activeCell, setActiveCell] = useState(1);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    document.title = "Experience | Shrirang Mahajan";
    const experience = fetchExperience();
    console.log(experience);
    setExperiences(experience);
  }, []);

  return (
    <div className={styles.ExperiencePage}>
      <div className={styles.ExperiencePageContainer}>
        <div className={styles.ExperiencePageContent}>
          <div className={styles.ExperiencePageTitle}>Experience</div>
          <div className={styles.ExperiencePageItemList}>
            {experiences &&
              experiences.map((experience) => {
                return (
                  <MarkdownCell
                    cell={{
                      id: experience.id,
                      output: (
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
                              width: "100%",
                            }}
                          >
                            <a
                              href={experience.link}
                              target="_blank"
                              className={styles.experienceName}
                            >
                              {experience.title}
                            </a>
                            <div className={styles.experienceDuration}>
                              {experience.duration}
                            </div>
                          </div>
                          <a
                            className={styles.experienceCompany}
                            href={experience.link}
                            target="_blank"
                          >
                            {experience.company}
                          </a>
                          <ul className={styles.experienceDescription}>
                            {experience.description.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ),
                    }}
                    activeCell={activeCell}
                    setActiveCell={setActiveCell}
                    key={experience.id}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
