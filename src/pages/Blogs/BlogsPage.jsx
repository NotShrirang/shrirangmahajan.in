import React, { useState, useEffect } from "react";
import styles from "./BlogsPage.module.css";
import BlogCard from "../../components/BlogCard/BlogCard";
import blogs from "../../data/blogs.js";
import Footer from "../../components/Footer/Footer.jsx";

const BlogsPage = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useState(new URLSearchParams());
  const searchQuery = searchParams.get("q") || "";
  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    setBlogsList(blogs);
    const tags = [];
    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    setTagsList(tags);
  }, []);

  document.title = "Blogs | Shrirang Mahajan";

  return (
    <div className={styles.BlogsPage}>
      <div className={styles.BlogsPageContainer}>
        <div className={styles.BlogsPageContent}>
          <h1 className={styles.BlogsPageTitle}>Blogs</h1>
          <div className={styles.BlogsSearchBar}>
            <div className={styles.BlogsSearchBarInputContainer}>
              <input
                type="text"
                className={styles.BlogsSearchBarInput}
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
                  const tempBlogs = blogs.filter((project) =>
                    project.tags.some((tag) => {
                      return tag.toLowerCase().includes(newQuery.toLowerCase());
                    })
                  );
                  setBlogsList(tempBlogs);
                }}
              />
            </div>
            <div className={styles.BlogsSearchBarFilter}>
              <select
                className={styles.BlogsSearchBarFilterSelect}
                onChange={(e) => {
                  const filter = e.target.value;
                  if (filter === "All") {
                    setBlogsList(blogs);
                  } else {
                    const tempProjects = blogs.filter(
                      (blog) => blog.domain === filter
                    );
                    setBlogsList(tempProjects);
                  }
                }}
              >
                <option value="All">All</option>
                {tagsList.map((tag) => (
                  <option value={tag} key={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.BlogsPageItemList}>
            {blogsList.length != 0 ? (
              blogsList.map((blog) => (
                <div className={styles.BlogsPageItem} key={blog.title}>
                  <BlogCard blog={blog} />
                </div>
              ))
            ) : (
              <div className={styles.NoBlogsFound}>
                <span>
                  Uhh ohh! You got me! I haven't written any blogs related to{" "}
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

export default BlogsPage;
