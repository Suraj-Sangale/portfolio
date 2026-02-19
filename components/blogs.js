"use client";

import { useEffect, useRef } from "react";
import styles from "../styles/blogs.module.css";

const BLOG_DATA = [
  {
    id: 1,
    accent: "#6366f1",
    emoji: "🧠",
    grad: "linear-gradient(135deg,#6366f1,#06b6d4)",
    category: "AI & ML",
    readTime: "8 min read",
    authorInitials: "AK",
    authorName: "Arjun Kapoor",
    date: "Feb 18, 2026",
    title: "The Hidden Architecture Behind Modern LLMs You Never See",
    excerpt:
      "Transformers are everywhere — but almost nobody talks about what actually makes attention mechanisms tick at the hardware level, and why it matters for the next generation of models.",
    views: "4.2k",
    likes: "238",
    link: "#",
  },
  {
    id: 2,
    accent: "#f43f5e",
    emoji: "🎨",
    grad: "linear-gradient(135deg,#f43f5e,#fb923c)",
    category: "Design",
    readTime: "5 min read",
    authorInitials: "SR",
    authorName: "Sneha Rao",
    date: "Feb 14, 2026",
    title: "Why Depth Cues Are the Most Underused Tool in UI Design",
    excerpt:
      "Shadows, parallax, and layered z-axis thinking can transform a flat interface into something that feels genuinely physical — without a single line of 3D code.",
    views: "6.7k",
    likes: "415",
    link: "#",
  },
  {
    id: 3,
    accent: "#10b981",
    emoji: "⚙️",
    grad: "linear-gradient(135deg,#10b981,#0ea5e9)",
    category: "Engineering",
    readTime: "12 min read",
    authorInitials: "PM",
    authorName: "Priya Mehta",
    date: "Feb 10, 2026",
    title: "Building Zero-Downtime Deploys at Scale: Lessons from 3 Years of Pain",
    excerpt:
      "Blue-green, canary, feature flags — we tried everything. Here's the honest breakdown of what actually worked for our 50-million-user platform and what didn't.",
    views: "9.1k",
    likes: "581",
    link: "#",
  },
  {
    id: 4,
    accent: "#f59e0b",
    emoji: "🚀",
    grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
    category: "Startup",
    readTime: "6 min read",
    authorInitials: "RV",
    authorName: "Rohan Verma",
    date: "Feb 6, 2026",
    title: "From 0 to $1M ARR: The Counter-Intuitive Growth Strategy We Bet Everything On",
    excerpt:
      "We ignored conventional wisdom, fired our sales team, and went product-led. Eighteen months later, here's what the data actually showed about that decision.",
    views: "12k",
    likes: "762",
    link: "#",
  },
  {
    id: 5,
    accent: "#a855f7",
    emoji: "🧬",
    grad: "linear-gradient(135deg,#a855f7,#ec4899)",
    category: "Science",
    readTime: "10 min read",
    authorInitials: "NK",
    authorName: "Nisha Krishnan",
    date: "Jan 30, 2026",
    title: "Protein Folding Changed Everything — But Nobody's Talking About What's Next",
    excerpt:
      "AlphaFold solved a 50-year problem. But the next frontier in computational biology is even more radical, and the implications for medicine are staggering.",
    views: "5.4k",
    likes: "319",
    link: "#",
  },
  {
    id: 6,
    accent: "#06b6d4",
    emoji: "🌐",
    grad: "linear-gradient(135deg,#06b6d4,#3b82f6)",
    category: "Web3",
    readTime: "7 min read",
    authorInitials: "DS",
    authorName: "Dev Shah",
    date: "Jan 25, 2026",
    title: "The Quiet Revolution in Zero-Knowledge Proofs Nobody's Noticed Yet",
    excerpt:
      "ZK proofs went from academic curiosity to real infrastructure in two years. Here's the technical breakdown of why this changes privacy on the internet forever.",
    views: "3.8k",
    likes: "204",
    link: "#",
  },
];

// ── SVG icons ──
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ── Single card with 3D tilt logic ──
function BlogCard({ blog, index }) {
  const cardRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    targetRx: 0, targetRy: 0,
    currentRx: 0, currentRy: 0,
    isHovered: false,
  });

  const MAX_TILT = 14;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const glare   = card.querySelector(`.${styles.cardGlare}`);
    const tagEl   = card.querySelector(`.${styles.cardTag}`);
    const rtEl    = card.querySelector(`.${styles.cardReadTime}`);
    const authEl  = card.querySelector(`.${styles.cardAuthor}`);
    const titleEl = card.querySelector(`.${styles.cardTitle}`);
    const excEl   = card.querySelector(`.${styles.cardExcerpt}`);
    const footEl  = card.querySelector(`.${styles.cardFooter}`);

    function lerp(a, b, t) { return a + (b - a) * t; }

    function mapZ(rx, ry, maxZ) {
      const mag = Math.sqrt(rx * rx + ry * ry) / MAX_TILT;
      return mag * maxZ;
    }

    function tick() {
      const s = stateRef.current;
      if (!s.isHovered && Math.abs(s.currentRx) < 0.01 && Math.abs(s.currentRy) < 0.01) {
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
        card.classList.add(styles.resting);
        animRef.current = null;
        return;
      }

      const speed = s.isHovered ? 0.14 : 0.07;
      s.currentRx = lerp(s.currentRx, s.targetRx, speed);
      s.currentRy = lerp(s.currentRy, s.targetRy, speed);

      card.style.transform = `rotateX(${s.currentRx}deg) rotateY(${s.currentRy}deg)`;

      const zFn = (max) => `translateZ(${mapZ(s.currentRx, s.currentRy, max)}px)`;
      if (tagEl)   tagEl.style.transform   = zFn(38);
      if (rtEl)    rtEl.style.transform    = zFn(30);
      if (authEl)  authEl.style.transform  = zFn(22);
      if (titleEl) titleEl.style.transform = zFn(36);
      if (excEl)   excEl.style.transform   = zFn(16);
      if (footEl)  footEl.style.transform  = zFn(26);

      animRef.current = requestAnimationFrame(tick);
    }

    function onMouseMove(e) {
      const s = stateRef.current;
      card.classList.remove(styles.resting);
      s.isHovered = true;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x - rect.width  / 2) / (rect.width  / 2);
      const ny = (y - rect.height / 2) / (rect.height / 2);

      s.targetRy =  nx * MAX_TILT;
      s.targetRx = -ny * MAX_TILT;

      const mx = (x / rect.width)  * 100;
      const my = (y / rect.height) * 100;
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.13) 0%, transparent 65%)`;
      }

      if (!animRef.current) animRef.current = requestAnimationFrame(tick);
    }

    function onMouseLeave() {
      const s = stateRef.current;
      s.isHovered = false;
      s.targetRx  = 0;
      s.targetRy  = 0;
      [tagEl, rtEl, authEl, titleEl, excEl, footEl].forEach(el => {
        if (el) el.style.transform = "translateZ(0px)";
      });
      if (!animRef.current) animRef.current = requestAnimationFrame(tick);
    }

    card.addEventListener("mousemove",  onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);
    return () => {
      card.removeEventListener("mousemove",  onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className={styles.cardWrap} style={{ animationDelay: `${index * 0.1 + 0.05}s` }}>
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
            {blog.emoji}
          </div>
          <span
            className={styles.cardTag}
            style={{ background: blog.accent, color: blog.accent === "#f59e0b" ? "#000" : "#fff" }}
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
              style={{ background: blog.accent, boxShadow: `0 0 12px ${blog.accent}`, color: blog.accent === "#f59e0b" ? "#000" : "#fff" }}
            >
              {blog.authorInitials}
            </div>
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{blog.authorName}</span>
              <span className={styles.authorDate}>{blog.date}</span>
            </div>
          </div>

          <h2 className={styles.cardTitle}>{blog.title}</h2>
          <p className={styles.cardExcerpt}>{blog.excerpt}</p>

          <div className={styles.cardFooter}>
            <div className={styles.cardStats}>
              <span className={styles.stat}><EyeIcon />{blog.views}</span>
              <span className={styles.stat}><HeartIcon />{blog.likes}</span>
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
  return (
    <div className={styles.page}>
      {/* starfield */}
      <div className={styles.stars} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>Latest Writings</p>
          <h1 className={styles.pageTitle}>Thoughts &amp; Articles</h1>
        </header>

        <div className={styles.cardsGrid}>
          {BLOG_DATA.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}