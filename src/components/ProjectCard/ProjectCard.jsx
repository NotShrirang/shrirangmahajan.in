import styles from "./ProjectCard.module.css";

const ProjectCard = ({ project }) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectCardHeader}>
        <div className={styles.projectCardTitle}>{project.title}</div>
        <div className={styles.projectCardSeparator}>|</div>
        <div className={styles.projectCardTagContainer}>
          {project.tags.map((tag) => (
            <span className={styles.projectCardTag} key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.projectCardContent}>
        <div className={styles.description}>
          <div>{project.description}</div>
        </div>
        <div className={styles.imageContainer}>
          <img
            src={project.image}
            alt={project.title}
            className={styles.projectCardImage}
          />
        </div>
      </div>
      {project.link && (
        <a
          className={styles.link}
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project
        </a>
      )}
    </div>
  );
};

export default ProjectCard;
