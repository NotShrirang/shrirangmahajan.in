import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./BlogCard.module.css";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/jupyter") ? "/jupyter" : "";
  const target = `${basePath}/blogs/${blog.slug}`;

  return (
    <div
      className={styles.BlogCard}
      onClick={() => {
        navigate(target);
        window.location.reload();
      }}
    >
      <div className={styles.BlogCardImageContainer}>
        <img
          src={blog.image}
          alt={blog.title}
          className={styles.BlogCardImage}
        />
      </div>
      <div className={styles.BlogCardInfo}>
        <div className={styles.BlogCardInfoTitle}>{blog.title}</div>
        <div className={styles.BlogCardInfoDetails}>
          <div className={styles.BlogCardDate}>
            {new Date(blog.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <a
            href={target}
            className={styles.BlogCardInfoReadMoreAnchor}
          >
            <div className={styles.BlogCardInfoReadMoreText}>Read More</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
