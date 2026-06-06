"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/blogs.module.scss";
import { postApiData } from "@/utilities/services/apiService";
import CustomTitle from "./Items/CustomTitle";
import Link from "next/link";

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
    <Link
      href={`/blogs/${blog.slug || '#'}`}
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
          {blog.categories?.length > 0 && (
            <span
              className={styles.cardTag}
              style={{
                background: blog.accent,
                color: blog.accent === "#f59e0b" ? "#000" : "#fff",
              }}
            >
              {blog.categories?.[0]}
            </span>
          )}
          {blog?.readTime && <span className={styles.cardReadTime}>{blog.readTime}</span>}
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
            <Link
              href={`/blogs/${blog.slug || '#'}`}
              className={styles.readBtn}
              style={{ color: blog.accent }}
            >
              Read More <span className={styles.arr}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </Link>
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
      let response = await postApiData("GET_MEDIUM_BLOGS");
      response = {
        "status": true,
        "data": [
          {
            "title": "Redis Cache: Boosting Application Performance with In-Memory Data",
            "slug": "redis-cache-boosting-application-performance-with-in-memory-data",
            "pubDate": "2026-03-23 18:23:09",
            "link": "https://medium.com/@surajsangle00/redis-cache-boosting-application-performance-with-in-memory-data-29dd64a3e60e?source=rss-785c80f302e1------2",
            "guid": "https://medium.com/p/29dd64a3e60e",
            "author": "Suraj sangle",
            "thumbnail": "https://cdn-images-1.medium.com/max/1024/0*NCJRXLG3GbXmoni6",
            "description": "\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/1024/0*NCJRXLG3GbXmoni6\"></figure><p>In modern web development, performance is critical. Applications are expected to respond instantly, even under heavy load. One of the most effective ways to achieve this is by using <strong>Redis</strong> as a caching layer</p>\n<p>This blog explains Redis caching, how it works, and how it can significantly improve application performance.</p>\n<h3>💡 What is Redis Cache?</h3>\n<p><strong>Redis</strong> is an open-source, in-memory data store used as a database, cache, and message broker.</p>\n<p>Redis caching refers to:</p>\n<blockquote><em>Temporarily storing frequently accessed data in memory to reduce the need for repeated database or API calls.</em></blockquote>\n<p>Because Redis operates in memory (RAM), it delivers extremely fast read and write operations.</p>\n<h3>⚡ Why Use Redis for Caching?</h3>\n<h3>1. High Performance</h3>\n<p>Redis processes data in memory, resulting in response times in milliseconds.</p>\n<h3>2. Reduced Database Load</h3>\n<p>Caching prevents repeated queries to the database, improving overall system efficiency.</p>\n<h3>3. Better User Experience</h3>\n<p>Faster data retrieval leads to smoother and more responsive applications.</p>\n<h3>4. Flexible Data Structures</h3>\n<p>Redis supports multiple data types:</p>\n<ul>\n<li>Strings</li>\n<li>Lists</li>\n<li>Sets</li>\n<li>Hashes</li>\n<li>Sorted Sets</li>\n</ul>\n<h3>🧠 How Redis Caching Works</h3>\n<p>A commonly used approach is the <strong>Cache-Aside Pattern</strong>:</p>\n<ol>\n<li>Client requests data</li>\n<li>Application checks Redis cache</li>\n<li>If data is found → return cached data</li>\n<li>If not found → fetch from database</li>\n<li>Store result in Redis</li>\n<li>Return response to client</li>\n</ol>\n<p>This approach ensures efficient data retrieval while keeping the cache updated.</p>\n<h3>🔧 Example: Redis in Node.js</h3>\n<p>Below is a simple example of Redis caching in a Node.js application:</p>\n<pre>import redis from \"redis\";</pre>\n<pre>const client = redis.createClient();</pre>\n<pre>client.connect();</pre>\n<pre>async function getUser(userId) {<br>  const cacheKey = `user:${userId}`;</pre>\n<pre>  // Check cache<br>  const cachedData = await client.get(cacheKey);</pre>\n<pre>  if (cachedData) {<br>    console.log(\"Cache Hit\");<br>    return JSON.parse(cachedData);<br>  }</pre>\n<pre>  console.log(\"Cache Miss\");</pre>\n<pre>  // Fetch from database (example)<br>  const user = { id: userId, name: \"User Name\" };</pre>\n<pre>  // Store in Redis with TTL<br>  await client.setEx(cacheKey, 60, JSON.stringify(user));</pre>\n<pre>  return user;<br>}</pre>\n<h3>⏳ Cache Expiration (TTL)</h3>\n<p>Redis allows setting a Time-To-Live (TTL) for cached data:</p>\n<pre>await client.setEx(\"key\", 60, \"value\"); // expires in 60 seconds</pre>\n<p>Benefits of using TTL:</p>\n<ul>\n<li>Prevents stale data</li>\n<li>Frees up memory automatically</li>\n<li>Keeps cache relevant and fresh</li>\n</ul>\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/663/1*_ei-2ndHpR6_Lx26DwL4Zg.png\"></figure><h3>🧩 Common Use Cases</h3>\n<p>Redis caching is widely used in:</p>\n<h3>🔹 API Response Caching</h3>\n<p>Stores frequently requested API results.</p>\n<h3>🔹 Session Management</h3>\n<p>Efficiently handles user sessions.</p>\n<h3>🔹 Rate Limiting</h3>\n<p>Controls the number of requests per user.</p>\n<h3>🔹 Real-Time Applications</h3>\n<p>Works well with WebSockets and live data systems.</p>\n<h3>⚠️ Challenges of Redis Caching</h3>\n<p>While Redis is powerful, it comes with some challenges:</p>\n<ul>\n<li>Cache invalidation can be complex</li>\n<li>Limited by available RAM</li>\n<li>Requires careful key management</li>\n</ul>\n<h3>🏗️ Best Practices</h3>\n<ul>\n<li>Use clear and consistent key naming conventions</li>\n<li>Always define expiration times (TTL)</li>\n<li>Avoid caching highly sensitive data</li>\n<li>Cache only frequently accessed data</li>\n<li>Monitor memory usage and performance</li>\n</ul>\n<img src=\"https://medium.com/_/stat?event=post.clientViewed&amp;referrerSource=full_rss&amp;postId=29dd64a3e60e\" width=\"1\" height=\"1\" alt=\"\">\n",
            "content": null,
            "enclosure": {},
            "categories": [
              "cache",
              "optimization",
              "redis"
            ],
            "authorInitials": "S",
            "accent": "#06b6d4",
            "emoji": "🌐",
            "grad": "linear-gradient(135deg,#06b6d4,#3b82f6)"
          },
          {
            "title": "Understanding Server-Side Rendering in Next.js",
            "slug": "understanding-server-side-rendering-in-next-js",
            "pubDate": "2026-03-23 17:47:53",
            "link": "https://medium.com/@surajsangle00/understanding-server-side-rendering-in-next-js-9d601aa73d61?source=rss-785c80f302e1------2",
            "guid": "https://medium.com/p/9d601aa73d61",
            "author": "Suraj sangle",
            "thumbnail": "https://cdn-images-1.medium.com/max/664/1*8kyJkES_9xO73pRskFwMQw.png",
            "description": "\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/664/1*8kyJkES_9xO73pRskFwMQw.png\"></figure><h3>My Journey with Server-Side Rendering in Next.js</h3>\n<p>When I first started working with modern web applications, performance and SEO were always two things that kept bothering me. I wanted my applications to load fast, rank well on search engines, and still feel dynamic. That’s when I seriously explored <strong>Server-Side Rendering (SSR)</strong> in Next.js — and honestly, it changed how I think about building web apps.</p>\n<h3>What Server-Side Rendering Means to Me</h3>\n<p>In simple terms, SSR is when the HTML of a page is generated on the server <strong>for every request</strong>, instead of being built in the browser. Before using it, I was heavily relying on client-side rendering, where the browser would fetch data and build the UI. It worked — but it wasn’t always optimal.</p>\n<p>When I switched to SSR in Next.js, I immediately noticed two things:</p>\n<ul>\n<li>My pages loaded with content already in place</li>\n<li>SEO improved because search engines could easily read my pages</li>\n</ul>\n<p>That was a big win.</p>\n<figure><img alt=\"My Journey with SSR\" src=\"https://cdn-images-1.medium.com/max/320/1*SQxL7G7xXRrNZR1O9zFnbw.png\"></figure><h3>How I Use SSR in Next.js</h3>\n<p>Next.js makes SSR incredibly straightforward. The first time I used it, I was surprised at how clean the implementation was.</p>\n<p>Here’s the basic pattern I follow:</p>\n<pre>export async function getServerSideProps(context) {<br>  const res = await fetch(\"https://api.example.com/data\");<br>  const data = await res.json();</pre>\n<pre>  return {<br>    props: { data }<br>  };<br>}</pre>\n<p>For me, getServerSideProps became the entry point for server-side logic. Every time a user hits the page, this function runs on the server, fetches fresh data, and sends a fully rendered page to the client.</p>\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/316/1*pf12sWBMrVHS6OJj5KeEmQ.png\"></figure><h3>Why I Prefer SSR in Certain Cases</h3>\n<p>Over time, I realized SSR is not something I should use everywhere — but in the right scenarios, it’s extremely powerful.</p>\n<h3>1. When Data Needs to Be Fresh</h3>\n<p>If I’m building something like a dashboard or live data page, SSR ensures users always see updated content.</p>\n<h3>2. When SEO Matters</h3>\n<p>For landing pages or public-facing content, SSR helps search engines index everything properly.</p>\n<h3>3. Faster First Paint</h3>\n<p>Users don’t have to wait for JavaScript to load and execute before seeing content. That improves perceived performance.</p>\n<h3>Challenges I Faced</h3>\n<p>It wasn’t all smooth sailing. I did hit a few challenges along the way.</p>\n<h3>Performance Concerns</h3>\n<p>Since SSR runs on every request, it can increase server load. I had to optimize APIs and sometimes introduce caching.</p>\n<h3>Slower Navigation Compared to CSR</h3>\n<p>Client-side transitions feel faster. SSR pages can feel slightly slower when navigating frequently.</p>\n<h3>Debugging Differences</h3>\n<p>Debugging server-side code felt different compared to browser-based debugging. I had to adjust my workflow.</p>\n<h3>How I Decide Between SSR and Other Methods</h3>\n<p>As I gained experience, I stopped blindly using SSR everywhere. Now, I make decisions based on the use case:</p>\n<ul>\n<li>\n<strong>SSR</strong> → When data must be real-time or SEO is critical</li>\n<li>\n<strong>SSG (Static Generation)</strong> → When content doesn’t change often</li>\n<li>\n<strong>CSR (Client-Side Rendering)</strong> → When interactivity matters more than SEO</li>\n</ul>\n<p>This balance helped me build more efficient applications.</p>\n<h3>My Takeaway</h3>\n<p>Server-Side Rendering in Next.js gave me a powerful tool to improve both performance and user experience. It taught me that rendering strategy is not just a technical choice — it directly impacts how users interact with my application.</p>\n<p>If I had to summarize my experience: SSR is not something I use everywhere, but when I do use it, it makes a noticeable difference.</p>\n<p>And honestly, once I got comfortable with it, I started enjoying the flexibility Next.js gives me to choose the right rendering approach for every page I build.</p>\n<img src=\"https://medium.com/_/stat?event=post.clientViewed&amp;referrerSource=full_rss&amp;postId=9d601aa73d61\" width=\"1\" height=\"1\" alt=\"\">\n",
            "content": null,
            "enclosure": {},
            "categories": [
              "server-side-rendering",
              "nextjs",
              "javascript",
              "optimization",
              "react"
            ],
            "authorInitials": "S",
            "accent": "#f59e0b",
            "emoji": "⚡",
            "grad": "linear-gradient(135deg,#f59e0b,#ef4444)"
          },
          {
            "title": "Understanding ES6: The JavaScript Upgrade That Changed Everything",
            "slug": "understanding-es6-the-javascript-upgrade-that-changed-everything",
            "pubDate": "2026-02-16 16:11:45",
            "link": "https://medium.com/@surajsangle00/understanding-es6-the-javascript-upgrade-that-changed-everything-9d1c2611acb4?source=rss-785c80f302e1------2",
            "guid": "https://medium.com/p/9d1c2611acb4",
            "author": "Suraj sangle",
            "thumbnail": "https://cdn-images-1.medium.com/max/1024/1*p2Dps-oqMuOPrIHHA6bJKg.png",
            "description": "\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/1024/1*p2Dps-oqMuOPrIHHA6bJKg.png\"></figure><p>ES6 (ECMAScript 2015) introduced modern JavaScript features like arrow functions, destructuring, spread operators, and modules that make code cleaner and more efficient.<br> It transformed JavaScript into a more powerful, readable, and maintainable language for building scalable web applications.</p>\n<figure><img alt=\"\" src=\"https://cdn-images-1.medium.com/max/299/0*LOVdsZZMN3HSCzs8\"><figcaption>JavaScript ES</figcaption></figure><h3>① Variable Declation typres <strong>— </strong>let and const (Block Scope)</h3>\n<p>Before ES6, we only had var, which caused scope issues.</p>\n<pre>let year = 2000;<br>const greet = \"Hello World\";<br><br>console.log(year);      // 2000<br>console.log(greet);  // Hello World</pre>\n<h3>② Arrow Functions (=&gt;)</h3>\n<p>Shorter function syntax.</p>\n<p>❌ Old way:</p>\n<pre>function add(a, b) {<br>  return a + b;<br>}</pre>\n<p>✅ ES6 way:</p>\n<pre>const add = (a, b) =&gt; a + b;</pre>\n<p>Bonus: Arrow functions don’t have their own this.</p>\n<p>Perfect for React &amp; Next.js projects.</p>\n<h3>③ Template Literals</h3>\n<p>No more string concatenation madness.</p>\n<p>❌ Old way:</p>\n<pre>console.log(\"Hello \" + name + \", welcome!\");</pre>\n<p>✅ ES6 way:</p>\n<pre>console.log(`Hello ${name}, welcome!`);</pre>\n<p>Much cleaner and readable.</p>\n<h3>④ Destructuring</h3>\n<p>Extract values easily from objects or arrays</p>\n<pre>const user = {<br>  name: \"Suraj\",<br>  role: \"Developer\"<br>};</pre>\n<pre>const { name, role } = user;</pre>\n<p>Used heavily in:</p>\n<ul>\n<li>React props</li>\n<li>API responses</li>\n<li>Function parameters</li>\n</ul>\n<h3>⑤ Spread Operator (…)</h3>\n<p>Copy or merge arrays/objects easily.</p>\n<pre>const arr1 = [1, 2];<br>const arr2 = [...arr1, 3, 4];</pre>\n<pre>console.log(arr2);<br>// [1, 2, 3, 4]</pre>\n<p>For objects:</p>\n<pre>const user = { name: \"Suraj\" };<br>const updatedUser = { ...user, role: \"Developer\" };</pre>\n<p>Super useful in state management.</p>\n<h3>⑥ Default Parameters</h3>\n<pre>const greet = (name = \"Guest\") =&gt; {<br>  console.log(`Hello ${name}`);<br>};</pre>\n<p>Cleaner than checking manually.</p>\n<h3>⑦ Modules (import / export)</h3>\n<p>Before ES6 → messy script files.</p>\n<p>Now:</p>\n<pre>// math.js<br>export const add = (a, b) =&gt; a + b;</pre>\n<pre>// app.js<br>import { add } from \"./math\";</pre>\n<img src=\"https://medium.com/_/stat?event=post.clientViewed&amp;referrerSource=full_rss&amp;postId=9d1c2611acb4\" width=\"1\" height=\"1\" alt=\"\">\n",
            "content": null,
            "enclosure": {},
            "categories": [],
            "authorInitials": "S",
            "accent": "#10b981",
            "emoji": "🚀",
            "grad": "linear-gradient(135deg,#10b981,#22c55e)"
          }
        ],
        "message": "Medium posts fetched successfully"
      }
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
