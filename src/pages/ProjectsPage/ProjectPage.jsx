import React, { useEffect } from "react";
import styles from "./ProjectPage.module.css";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { projects } from "../../data/projects";

const ProjectPage = () => {
  useEffect(() => {
    document.title = "Projects | Shrirang Mahajan";
  }, []);
  return (
    <div className={styles.projectPage}>
      <div className={styles.projectPageContainer}>
        <div className={styles.projectPageContent}>
          <div className={styles.projectPageTitle}>Projects</div>
          <div className={styles.projectPageItemList}>
            {projects.map((project) => (
              <div className={styles.projectPageItem} key={project.title}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
