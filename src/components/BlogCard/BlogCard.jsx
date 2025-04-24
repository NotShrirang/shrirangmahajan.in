import React from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./BlogCard.module.css";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.BlogCard}
      onClick={() => {
        navigate(`/blogs/${blog.slug}`);
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
            href={`/blogs/${blog.slug}`}
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
