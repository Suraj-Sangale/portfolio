"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/blogs.module.css";
import { postApiData } from "@/utilities/services/apiService";
import CustomTitle from "./Items/CustomTitle";

// ── SVG icons ──
const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle
      cx="12"
      cy="12"
      r="3"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={styles.icon}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ── Single card with 3D tilt logic ──
function BlogCard({ blog, index }) {
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

  const cardRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    targetRx: 0,
    targetRy: 0,
    currentRx: 0,
    currentRy: 0,
    isHovered: false,
  });

  const MAX_TILT = 14;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const glare = card.querySelector(`.${styles.cardGlare}`);
    const tagEl = card.querySelector(`.${styles.cardTag}`);
    const rtEl = card.querySelector(`.${styles.cardReadTime}`);
    const authEl = card.querySelector(`.${styles.cardAuthor}`);
    const titleEl = card.querySelector(`.${styles.cardTitle}`);
    const excEl = card.querySelector(`.${styles.cardExcerpt}`);
    const footEl = card.querySelector(`.${styles.cardFooter}`);

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function mapZ(rx, ry, maxZ) {
      const mag = Math.sqrt(rx * rx + ry * ry) / MAX_TILT;
      return mag * maxZ;
    }

    function tick() {
      const s = stateRef.current;
      if (
        !s.isHovered &&
        Math.abs(s.currentRx) < 0.01 &&
        Math.abs(s.currentRy) < 0.01
      ) {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
        card.classList.add(styles.resting);
        animRef.current = null;
        return;
      }

      const speed = s.isHovered ? 0.14 : 0.07;
      s.currentRx = lerp(s.currentRx, s.targetRx, speed);
      s.currentRy = lerp(s.currentRy, s.targetRy, speed);

      card.style.transform = `rotateX(${s.currentRx}deg) rotateY(${s.currentRy}deg)`;

      const zFn = (max) =>
        `translateZ(${mapZ(s.currentRx, s.currentRy, max)}px)`;
      if (tagEl) tagEl.style.transform = zFn(38);
      if (rtEl) rtEl.style.transform = zFn(30);
      if (authEl) authEl.style.transform = zFn(22);
      if (titleEl) titleEl.style.transform = zFn(36);
      if (excEl) excEl.style.transform = zFn(16);
      if (footEl) footEl.style.transform = zFn(26);

      animRef.current = requestAnimationFrame(tick);
    }

    function onMouseMove(e) {
      const s = stateRef.current;
      card.classList.remove(styles.resting);
      s.isHovered = true;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x - rect.width / 2) / (rect.width / 2);
      const ny = (y - rect.height / 2) / (rect.height / 2);

      s.targetRy = nx * MAX_TILT;
      s.targetRx = -ny * MAX_TILT;

      const mx = (x / rect.width) * 100;
      const my = (y / rect.height) * 100;
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.13) 0%, transparent 65%)`;
      }

      if (!animRef.current) animRef.current = requestAnimationFrame(tick);
    }

    function onMouseLeave() {
      const s = stateRef.current;
      s.isHovered = false;
      s.targetRx = 0;
      s.targetRy = 0;
      [tagEl, rtEl, authEl, titleEl, excEl, footEl].forEach((el) => {
        if (el) el.style.transform = "translateZ(0px)";
      });
      if (!animRef.current) animRef.current = requestAnimationFrame(tick);
    }

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);
    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className={styles.cardWrap}
      style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
    >
      <div
        ref={cardRef}
        className={`${styles.card} ${styles.resting}`}
        style={{ "--accent": blog.accent }}
      >
        {/* glare overlay */}
        <div className={styles.cardGlare} />
        {/* ambient glow */}
        <div className={styles.cardGlow} />

        {/* image */}
        <div className={styles.cardImgWrap}>
          <div
            className={styles.imgPlaceholder}
            style={{ "--grad": blog.grad }}
          >
            {blog.thumbnail ? (
              <img
                src={blog.thumbnail || ""}
                alt={blog.title}
                className={styles.cardImg}
              />
            ) : (
              <span className={styles.imgEmoji}>{blog.emoji}</span>
            )}
          </div>
          <span
            className={styles.cardTag}
            style={{
              background: blog.accent,
              color: blog.accent === "#f59e0b" ? "#000" : "#fff",
            }}
          >
            {blog.category}
          </span>
          <span className={styles.cardReadTime}>{blog.readTime}</span>
        </div>

        {/* body */}
        <div className={styles.cardBody}>
          <div className={styles.cardAuthor}>
            <div
              className={styles.authorAvatar}
              style={{
                background: blog.accent,
                boxShadow: `0 0 12px ${blog.accent}`,
                color: blog.accent === "#f59e0b" ? "#000" : "#fff",
              }}
            >
              {blog.authorInitials}
            </div>
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{blog.author}</span>
              <span className={styles.authorDate}>{blog.date}</span>
            </div>
          </div>

          <h2 className={styles.cardTitle}>{blog.title}</h2>
          {/* <p className={styles.cardExcerpt}>{blog.excerpt}</p> */}
          <p className={styles.cardExcerpt}>{stripHtml(blog.description)}</p>

          <div className={styles.cardFooter}>
            <div className={styles.cardStats}>
              <span className={styles.stat}>
                <EyeIcon />
                {blog.views}
              </span>
              <span className={styles.stat}>
                <HeartIcon />
                {blog.likes}
              </span>
            </div>
            <a
              href={blog.link}
              className={styles.readBtn}
              style={{ color: blog.accent }}
            >
              Read More <span className={styles.arr}>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page component ──
export default function BlogCards() {
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
      //       sampleResposne ={
      //     "status": true,
      //     "data": [
      //         {
      //             "title": "Understanding ES6: The JavaScript Upgrade That Changed Everything",
      //             "pubDate": "2026-02-16 16:11:45",
      //             "link": "https://medium.com/@surajsangle00/understanding-es6-the-javascript-upgrade-that-changed-everything-9d1c2611acb4?source=rss-785c80f302e1------2",
      //             "guid": "https://medium.com/p/9d1c2611acb4",
      //             "author": "Suraj sangle",
      //             "thumbnail": "https://cdn-images-1.medium.com/max/1024/1*p2Dps-oqMuOPrIHHA6bJKg.png",
      //             "description": "\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/1024/1*p2Dps-oqMuOPrIHHA6bJKg.png\"></figure><p>ES6 (ECMAScript 2015) introduced modern JavaScript features like arrow functions, destructuring, spread operators, and modules that make code cleaner and more efficient.<br> It transformed JavaScript into a more powerful, readable, and maintainable language for building scalable web applications.</p>\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/299/0*LOVdsZZMN3HSCzs8\"><figcaption>JavaScript ES</figcaption></figure><h3>① Variable Declation typres <strong>— </strong>let and const (Block Scope)</h3>\n<p>Before ES6, we only had var, which caused scope issues.</p>\n<pre>let year = 2000;<br>const greet = \"Hello World\";<br><br>console.log(year);      // 2000<br>console.log(greet);  // Hello World</pre>\n<h3>② Arrow Functions (=&gt;)</h3>\n<p>Shorter function syntax.</p>\n<p>❌ Old way:</p>\n<pre>function add(a, b) {<br>  return a + b;<br>}</pre>\n<p>✅ ES6 way:</p>\n<pre>const add = (a, b) =&gt; a + b;</pre>\n<p>Bonus: Arrow functions don’t have their own this.</p>\n<p>Perfect for React &amp; Next.js projects.</p>\n<h3>③ Template Literals</h3>\n<p>No more string concatenation madness.</p>\n<p>❌ Old way:</p>\n<pre>console.log(\"Hello \" + name + \", welcome!\");</pre>\n<p>✅ ES6 way:</p>\n<pre>console.log(`Hello ${name}, welcome!`);</pre>\n<p>Much cleaner and readable.</p>\n<h3>④ Destructuring</h3>\n<p>Extract values easily from objects or arrays</p>\n<pre>const user = {<br>  name: \"Suraj\",<br>  role: \"Developer\"<br>};</pre>\n<pre>const { name, role } = user;</pre>\n<p>Used heavily in:</p>\n<ul>\n<li>React props</li>\n<li>API responses</li>\n<li>Function parameters</li>\n</ul>\n<h3>⑤ Spread Operator (…)</h3>\n<p>Copy or merge arrays/objects easily.</p>\n<pre>const arr1 = [1, 2];<br>const arr2 = [...arr1, 3, 4];</pre>\n<pre>console.log(arr2);<br>// [1, 2, 3, 4]</pre>\n<p>For objects:</p>\n<pre>const user = { name: \"Suraj\" };<br>const updatedUser = { ...user, role: \"Developer\" };</pre>\n<p>Super useful in state management.</p>\n<h3>⑥ Default Parameters</h3>\n<pre>const greet = (name = \"Guest\") =&gt; {<br>  console.log(`Hello ${name}`);<br>};</pre>\n<p>Cleaner than checking manually.</p>\n<h3>⑦ Modules (import / export)</h3>\n<p>Before ES6 → messy script files.</p>\n<p>Now:</p>\n<pre>// math.js<br>export const add = (a, b) =&gt; a + b;</pre>\n<pre>// app.js<br>import { add } from \"./math\";</pre>\n<img src=\"https://medium.com/_/stat?event=post.clientViewed&amp;referrerSource=full_rss&amp;postId=9d1c2611acb4\" width=\"1\" height=\"1\" alt=\"\">\n",
      //             "content": "\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/1024/1*p2Dps-oqMuOPrIHHA6bJKg.png\"></figure><p>ES6 (ECMAScript 2015) introduced modern JavaScript features like arrow functions, destructuring, spread operators, and modules that make code cleaner and more efficient.<br> It transformed JavaScript into a more powerful, readable, and maintainable language for building scalable web applications.</p>\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/299/0*LOVdsZZMN3HSCzs8\"><figcaption>JavaScript ES</figcaption></figure><h3>① Variable Declation typres <strong>— </strong>let and const (Block Scope)</h3>\n<p>Before ES6, we only had var, which caused scope issues.</p>\n<pre>let year = 2000;<br>const greet = \"Hello World\";<br><br>console.log(year);      // 2000<br>console.log(greet);  // Hello World</pre>\n<h3>② Arrow Functions (=&gt;)</h3>\n<p>Shorter function syntax.</p>\n<p>❌ Old way:</p>\n<pre>function add(a, b) {<br>  return a + b;<br>}</pre>\n<p>✅ ES6 way:</p>\n<pre>const add = (a, b) =&gt; a + b;</pre>\n<p>Bonus: Arrow functions don’t have their own this.</p>\n<p>Perfect for React &amp; Next.js projects.</p>\n<h3>③ Template Literals</h3>\n<p>No more string concatenation madness.</p>\n<p>❌ Old way:</p>\n<pre>console.log(\"Hello \" + name + \", welcome!\");</pre>\n<p>✅ ES6 way:</p>\n<pre>console.log(`Hello ${name}, welcome!`);</pre>\n<p>Much cleaner and readable.</p>\n<h3>④ Destructuring</h3>\n<p>Extract values easily from objects or arrays</p>\n<pre>const user = {<br>  name: \"Suraj\",<br>  role: \"Developer\"<br>};</pre>\n<pre>const { name, role } = user;</pre>\n<p>Used heavily in:</p>\n<ul>\n<li>React props</li>\n<li>API responses</li>\n<li>Function parameters</li>\n</ul>\n<h3>⑤ Spread Operator (…)</h3>\n<p>Copy or merge arrays/objects easily.</p>\n<pre>const arr1 = [1, 2];<br>const arr2 = [...arr1, 3, 4];</pre>\n<pre>console.log(arr2);<br>// [1, 2, 3, 4]</pre>\n<p>For objects:</p>\n<pre>const user = { name: \"Suraj\" };<br>const updatedUser = { ...user, role: \"Developer\" };</pre>\n<p>Super useful in state management.</p>\n<h3>⑥ Default Parameters</h3>\n<pre>const greet = (name = \"Guest\") =&gt; {<br>  console.log(`Hello ${name}`);<br>};</pre>\n<p>Cleaner than checking manually.</p>\n<h3>⑦ Modules (import / export)</h3>\n<p>Before ES6 → messy script files.</p>\n<p>Now:</p>\n<pre>// math.js<br>export const add = (a, b) =&gt; a + b;</pre>\n<pre>// app.js<br>import { add } from \"./math\";</pre>\n<img src=\"https://medium.com/_/stat?event=post.clientViewed&amp;referrerSource=full_rss&amp;postId=9d1c2611acb4\" width=\"1\" height=\"1\" alt=\"\">\n",
      //             "enclosure": {},
      //             "categories": [],
      //             "authorInitials": "M",
      //             "accent": "#06b6d4",
      //             "emoji": "🌐",
      //             "grad": "linear-gradient(135deg,#06b6d4,#3b82f6)",
      //             "category": "Web3",
      //             "readTime": "7 min read",
      //             "date": "Jan 25, 2026",
      //             "views": "3.8k",
      //             "likes": "204"
      //         }
      //     ],
      //     "message": "Medium posts fetched successfully"
      // }
      if (response.status && Array.isArray(response.data)) {
        setBlogs(response.data);
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

  return (
    <div className={styles.page}>
      {/* starfield */}
      <div
        className={styles.stars}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <CustomTitle
          subheading={"Blogs"}
          mainText={"Thoughts & "}
          highlightedText={"Articles"}
        />
        {/* <header className={styles.pageHeader}>
           <p className={styles.eyebrow}>Latest Writings</p> 
          <h1 className={styles.pageTitle}>Thoughts &amp; Articles</h1>
        </header>*/}

        <div className={styles.cardsGrid}>
          {blogs.map((blog, i) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
