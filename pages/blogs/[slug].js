import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import styles from "@/styles/blogDetails.module.scss";
import { postApiData } from "@/utilities/services/apiService";
import Link from "next/link";
import CustomTitle from "@/components/Items/CustomTitle";

export default function BlogDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);


  useEffect(() => {
    if (slug) {
      fetchBlogDetails();
    }
  }, [slug]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all blogs
      const response = await postApiData("GET_MEDIUM_BLOGS");
      if (response.status && Array.isArray(response.data)) {
        // Find the blog with the matching slug
        const currentBlog = response.data.find((b) => b.slug === slug);
        if (currentBlog) {
          setBlog(currentBlog);
        } else {
          setError("Blog not found");
        }
      } else {
        setError("Failed to load blog");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.page}>
          <div className={styles.inner} style={{ textAlign: "center", color: "#fff" }}>
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className={styles.page}>
          <div className={styles.inner} style={{ textAlign: "center", color: "#fff" }}>
            <h2>{error || "Blog not found"}</h2>
            <Link href="/blogs" style={{ color: "#6366f1", marginTop: "1rem", display: "inline-block" }}>
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <article    className={`${styles.blogArticle} ${
      darkMode ? styles.dark : styles.warmLight
    }`}>
         <button
      className={styles.themeToggle}
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
        <div className={styles.hero}>
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className={styles.heroImage}
          />

          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span>/</span>

                <Link href="/blogs">Blogs</Link>
                <span>/</span>

                <span className={styles.current}>
                  {blog.title}
                </span>
              </nav>
<br/>
              <span className={styles.badge}>
                Development
              </span>

              <h1>{blog.title}</h1>

              <div className={styles.authorSection}>
                <div className={styles.avatar}>
                  {blog.authorInitials}
                </div>

                <div>
                  <h4>{blog.author}</h4>
                  <p>
                    {new Date(blog.pubDate).toLocaleDateString()}
                    • 5 min read
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentWrapper}>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{
              __html: blog.content || blog.description,
            }}
          />
        </div>
      </article>
    </>
  );
}
