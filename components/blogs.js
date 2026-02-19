import React, { useState, useEffect } from "react";
import CustomTitle from "./Items/CustomTitle";
import { postApiData } from "@/utilities/services/apiService";
import styles from "@/styles/blogs.module.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApiData("GET_MEDIUM_BLOGS");
      if (Array.isArray(response)) {
        console.log('response', response)
        setBlogs(response);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
  };

  return (
    <div className={`section relative ${styles.blogsSection}`} id="blogs">
      <div className="md:ml-36">
        <CustomTitle
          subheading="My"
          mainText="Blogs"
          highlightedText="Articles"
        />
      </div>
      <div className="m-[4%]">
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>Loading amazing blogs...</div>
            {/* Skeleton Loaders */}
            <div className={styles.blogsGrid} style={{ marginTop: "2rem" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonLine}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorText}>{error}</div>
            <button
              onClick={fetchBlogs}
              className={styles.errorButton}
            >
              Try Again
            </button>
          </div>
        )}
        {!loading && !error && blogs.length === 0 && (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIcon}>📝</div>
            <div className={styles.emptyText}>No blogs found.</div>
          </div>
        )}
        {!loading && !error && blogs.length > 0 && (
          <div className={styles.blogsGrid}>
            {blogs.map((blog, index) => (
              <div
                key={index}
                className={styles.blogCard}
                onClick={() => window.open(blog.link, "_blank")}
              >
                {blog.thumbnail && (
                  <div className={styles.imageContainer}>
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className={styles.blogImage}
                    />
                  </div>
                )}
                <div className={styles.contentContainer}>
                  <h3 className={styles.blogTitle}>{blog.title}</h3>
                  {blog.description && (
                    <p className={styles.blogDescription}>
                      {stripHtml(blog.description)}
                    </p>
                  )}
                  <div className={styles.blogFooter}>
                    <span className={styles.blogDate}>
                      {formatDate(blog.pubDate)}
                    </span>
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readMoreLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

