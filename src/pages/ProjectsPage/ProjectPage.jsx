import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ProjectPage.module.css";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { projects } from "../../data/projects";

const ProjectPage = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    document.title = "Projects | Shrirang Mahajan";
    if (searchQuery !== "") {
      const tempProjects = projects.filter((project) => {
        var found = project.tags.some((tag) => {
          return tag.toLowerCase().includes(searchQuery.toLowerCase());
        });
        if (found) {
          return true;
        }
        if (project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        if (
          project.description
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
      setProjectsList(tempProjects);
    } else {
      setProjectsList(projects);
    }
  }, [searchQuery]);

  return (
    <div className={styles.projectPage}>
      <div className={styles.projectPageContainer}>
        <div className={styles.projectPageContent}>
          <div className={styles.projectPageTitle}>Projects</div>
          <div className={styles.projectSearchBar}>
            <input
              type="text"
              className={styles.projectSearchBarInput}
              placeholder="Search Projects (Keyword based)"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                const newQuery = e.target.value;
                const newParams = new URLSearchParams(searchParams);

                if (newQuery) {
                  newParams.set("q", newQuery);
                } else {
                  newParams.delete("q");
                }

                setSearchParams(newParams);
                const tempProjects = projects.filter((project) =>
                  project.tags.some((tag) => {
                    return tag.toLowerCase().includes(newQuery.toLowerCase());
                  })
                );
                setProjectsList(tempProjects);
              }}
            />
          </div>
          <div className={styles.projectPageItemList}>
            {projectsList.length != 0 ? (
              projectsList.map((project) => (
                <div className={styles.projectPageItem} key={project.title}>
                  <ProjectCard project={project} />
                </div>
              ))
            ) : (
              <div className={styles.noProjectsFound}>
                <span>
                  Unfortunately, I am yet to work on a project related to{" "}
                  <b>"{searchQuery}"</b>!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
