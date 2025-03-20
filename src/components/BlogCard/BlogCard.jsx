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
      }}
    >
      <img src={blog.image} alt={blog.title} className={styles.BlogCardImage} />
      <div className={styles.BlogCardInfo}>
        <div className={styles.BlogCardInfoTitle}>{blog.title}</div>
        <div className={styles.BlogCardInfoDescription}>{blog.description}</div>
        <div className={styles.BlogCardDate}>{blog.date}</div>
        <a
          href={`/blogs/${blog.slug}`}
          className={styles.BlogCardInfoReadMoreAnchor}
        >
          <div className={styles.BlogCardInfoReadMoreText}>Read More</div>
        </a>
      </div>
    </div>
  );
};

export default BlogCard;
