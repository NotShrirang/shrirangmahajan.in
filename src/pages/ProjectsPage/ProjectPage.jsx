import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ProjectPage.module.css";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { projects } from "../../data/projects";
import Footer from "../../components/Footer/Footer";

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
            <div className={styles.projectSearchBarInputContainer}>
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
            <div className={styles.projectSearchBarFilter}>
              <select
                className={styles.projectSearchBarFilterSelect}
                onChange={(e) => {
                  const filter = e.target.value;
                  if (filter === "All") {
                    setProjectsList(projects);
                  } else {
                    const tempProjects = projects.filter(
                      (project) => project.domain === filter
                    );
                    setProjectsList(tempProjects);
                  }
                }}
              >
                <option value="All">All</option>
                <option value="ML">ML</option>
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
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
      <Footer />
    </div>
  );
};

export default ProjectPage;
