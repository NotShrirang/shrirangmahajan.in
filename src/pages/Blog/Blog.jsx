import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Blog.module.css";
import blogs from "../../data/blogs";
import Footer from "../../components/Footer/Footer";
import BlogCard from "../../components/BlogCard/BlogCard";

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState({});
  const [theme, setTheme] = useState("light");
  const [similarBlogs, setSimilarBlogs] = useState([]);

  useEffect(() => {
    blogs.forEach((blog) => {
      if (blog.slug === slug) {
        setBlog(blog);
      }
    });
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(theme);

    const thisBlog = blogs.filter((blog) => blog.slug === slug)[0];

    const tempBlogs = blogs
      .map((blog) => {
        if (thisBlog.slug === blog.slug) return null;
        const commonTags = blog.tags.filter((tag) =>
          thisBlog.tags.includes(tag)
        );
        return { ...blog, similarity: commonTags.length };
      })
      .filter((blog) => blog && blog.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);
    setSimilarBlogs(tempBlogs);
  }, [slug]);

  if (Object.keys(blog).length === 0) {
    document.title = "Blog Not Found | Shrirang Mahajan";
    return (
      <div>
        <h1>Blog</h1>
        <p>Blog not found</p>
      </div>
    );
  }
  document.title = `${blog.title} | Shrirang Mahajan`;
  return (
    <div className={styles.Blog}>
      <div className={styles.BlogContainer}>
        <div className={styles.BlogContent}>
          <h1 className={styles.BlogTitle}>{blog.title}</h1>
          <div className={styles.BlogMetaContainer}>
            <div className={styles.BlogMeta}>
              <div className={styles.BlogDate}>{blog.date}</div>
              <div className={styles.BlogReadTime}>
                <img
                  src={`https://img.icons8.com/?size=20&id=85028&format=png&color=${
                    theme == "dark" ? "ffffff" : "000000"
                  }`}
                  alt={`${blog.readTime} min read`}
                />
                {blog.readTime} min read
              </div>
            </div>
            <div className={styles.BlogTags}>
              {blog.tags.map((tag) => (
                <span key={tag} className={styles.BlogTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.BlogDescription}>{blog.content}</div>
        </div>
        <hr className={styles.BlogSeparator} />
        <div className={styles.BlogBottomBar}>
          <div style={{ textAlign: "center" }}>
            All content is licensed under the{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">
              {" "}
              CC BY-SA 4.0 License{" "}
            </a>{" "}
            unless otherwise specified!
          </div>
          <div style={{ textAlign: "center" }}>
            If you liked this blog, consider sharing it with your friends!
          </div>
          <div className={styles.BlogShare}>
            <div>Share it on:</div>
            <div className={styles.BlogShareButtons}>
              <a
                href={`https://twitter.com/intent/tweet?text=Read%20this%20amazing%20blog%20"${blog.title
                  .toString()
                  .split(" ")
                  .join("%20")}"%20by%20@notshrirang!&url=${
                  window.location.href
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.BlogShareButton}
              >
                <img
                  src={`https://img.icons8.com/?size=30&id=fJp7hepMryiw&format=png&color=${
                    theme == "dark" ? "ffffff" : "000000"
                  }`}
                  alt="X"
                />
                X
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href.replace(
                  " ",
                  "-"
                )}&title=${blog.title}source=${window.location.href}`}
                onClick={() => {
                  window.open(
                    this.href,
                    "mywin",
                    "left=20,top=20,width=500,height=500,toolbar=1,resizable=0"
                  );
                  return false;
                }}
                className={styles.BlogShareButton}
              >
                <img
                  src={`https://img.icons8.com/?size=30&id=13930&format=png&color=${
                    theme == "dark" ? "ffffff" : "000000"
                  }`}
                  alt="LinkedIn"
                />
                LinkedIn
              </a>
              <a
                href={`https://www.reddit.com/r/${blog.tags[0].replace(
                  " ",
                  ""
                )}/submit?url=${window.location.href.replace(" ", "-")}&title=${
                  blog.title
                }source=${window.location.href}`}
                onClick={() => {
                  window.open(
                    this.href,
                    "mywin",
                    "left=20,top=20,width=500,height=500,toolbar=1,resizable=0"
                  );
                  return false;
                }}
                className={styles.BlogShareButton}
              >
                <img
                  src={`https://img.icons8.com/?size=30&id=kshUdu5u4FCX&format=png&color=${
                    theme == "dark" ? "ffffff" : "000000"
                  }`}
                  alt="Reddit"
                />
                Reddit
              </a>
            </div>
          </div>
          {similarBlogs.length > 0 && (
            <div className={styles.BlogSimilarBlogs}>
              <h2>Similar Blogs</h2>
              <div className={styles.BlogSimilarBlogsContainer}>
                {similarBlogs.slice(0, 2).map((blog) => (
                  <BlogCard blog={blog} key={blog.title} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
