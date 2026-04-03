import { useState, useEffect, useRef } from "react";

// ─── GOOGLE FONTS (add to your index.html <head>) ───────────────────────────
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800
//   &family=DM+Mono:wght@400;500&family=Playfair+Display:wght@400;700;900
//   &family=Plus+Jakarta+Sans:wght@400;500;600;700
//   &family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@300;400;600;700
//   &display=swap" rel="stylesheet"/>

// ─── THEMES ─────────────────────────────────────────────────────────────────
const THEMES = {
  cyber: {
    name: "Cyber",
    dot: "#7fffd4",
    bg: "#0a0a0f",
    surface: "#111118",
    card: "#16161f",
    accent: "#7fffd4",
    accentRgb: "127,255,212",
    text: "#e8e8f0",
    muted: "#7a7a9a",
    border: "rgba(127,255,212,0.12)",
    borderHover: "rgba(127,255,212,0.38)",
    hf: "'Syne', sans-serif",
    bf: "'DM Mono', monospace",
    stroke: "rgba(127,255,212,0.6)",
    tbg: "rgba(127,255,212,0.06)",
    tc: "#7fffd4",
    r: "2px",
  },
  ocean: {
    name: "Ocean",
    dot: "#38bdf8",
    bg: "#050f1a",
    surface: "#091524",
    card: "#0d1e30",
    accent: "#38bdf8",
    accentRgb: "56,189,248",
    text: "#daeeff",
    muted: "#4a7a9a",
    border: "rgba(56,189,248,0.1)",
    borderHover: "rgba(56,189,248,0.32)",
    hf: "'Space Grotesk', sans-serif",
    bf: "'DM Mono', monospace",
    stroke: "rgba(56,189,248,0.5)",
    tbg: "rgba(56,189,248,0.07)",
    tc: "#38bdf8",
    r: "4px",
  },
  sunset: {
    name: "Sunset",
    dot: "#ff8c61",
    bg: "#1a0a0a",
    surface: "#1f1010",
    card: "#261414",
    accent: "#ff8c61",
    accentRgb: "255,140,97",
    text: "#f0e4dc",
    muted: "#9a7a6a",
    border: "rgba(255,140,97,0.12)",
    borderHover: "rgba(255,140,97,0.38)",
    hf: "'Outfit', sans-serif",
    bf: "'Plus Jakarta Sans', sans-serif",
    stroke: "rgba(255,140,97,0.6)",
    tbg: "rgba(255,140,97,0.08)",
    tc: "#ff8c61",
    r: "6px",
  },
  forest: {
    name: "Forest",
    dot: "#86efac",
    bg: "#0a120a",
    surface: "#0f1a0f",
    card: "#141f14",
    accent: "#86efac",
    accentRgb: "134,239,172",
    text: "#e4f0e4",
    muted: "#6a8a6a",
    border: "rgba(134,239,172,0.1)",
    borderHover: "rgba(134,239,172,0.32)",
    hf: "'Outfit', sans-serif",
    bf: "'Plus Jakarta Sans', sans-serif",
    stroke: "rgba(134,239,172,0.5)",
    tbg: "rgba(134,239,172,0.07)",
    tc: "#86efac",
    r: "10px",
  },
  candy: {
    name: "Candy",
    dot: "#a855f7",
    bg: "#faf5ff",
    surface: "#f3e8ff",
    card: "#ffffff",
    accent: "#a855f7",
    accentRgb: "168,85,247",
    text: "#1e0a30",
    muted: "#9a7aaa",
    border: "rgba(168,85,247,0.12)",
    borderHover: "rgba(168,85,247,0.38)",
    hf: "'Syne', sans-serif",
    bf: "'Plus Jakarta Sans', sans-serif",
    stroke: "rgba(168,85,247,0.5)",
    tbg: "rgba(168,85,247,0.08)",
    tc: "#a855f7",
    r: "12px",
  },
  paper: {
    name: "Paper",
    dot: "#1a1a2e",
    bg: "#f5f4f0",
    surface: "#eeede9",
    card: "#ffffff",
    accent: "#1a1a2e",
    accentRgb: "26,26,46",
    text: "#1a1a2e",
    muted: "#7a7a8a",
    border: "rgba(26,26,46,0.1)",
    borderHover: "rgba(26,26,46,0.32)",
    hf: "'Playfair Display', serif",
    bf: "'Plus Jakarta Sans', sans-serif",
    stroke: "rgba(26,26,46,0.7)",
    tbg: "rgba(26,26,46,0.06)",
    tc: "#1a1a2e",
    r: "8px",
  },
  frost: {
    name: "Frost",
    dot: "#22d3ee",
    bg: "#ecfeff",
    surface: "#dff9ff",
    card: "#ffffff",
    accent: "#06b6d4",
    accentRgb: "6,182,212",
    text: "#083344",
    muted: "#4b7c85",
    border: "rgba(6,182,212,0.12)",
    borderHover: "rgba(6,182,212,0.3)",
    hf: "'Space Grotesk', sans-serif",
    bf: "'Plus Jakarta Sans', sans-serif",
    stroke: "rgba(6,182,212,0.5)",
    tbg: "rgba(6,182,212,0.08)",
    tc: "#06b6d4",
    r: "10px",
  },
  lava: {
    name: "Lava",
    dot: "#ef4444",
    bg: "#140a0a",
    surface: "#1c0f0f",
    card: "#2a1414",
    accent: "#ef4444",
    accentRgb: "239,68,68",
    text: "#ffe4e4",
    muted: "#a66a6a",
    border: "rgba(239,68,68,0.12)",
    borderHover: "rgba(239,68,68,0.35)",
    hf: "'Syne', sans-serif",
    bf: "'DM Mono', monospace",
    stroke: "rgba(239,68,68,0.6)",
    tbg: "rgba(239,68,68,0.08)",
    tc: "#ef4444",
    r: "4px",
  },
  ocean: {
    name: "Ocean",
    dot: "#38bdf8",
    bg: "#050f1a",
    surface: "#091524",
    card: "#0d1e30",
    accent: "#38bdf8",
    accentRgb: "56,189,248",
    text: "#daeeff",
    muted: "#4a7a9a",
    border: "rgba(56,189,248,0.1)",
    borderHover: "rgba(56,189,248,0.32)",
    hf: "'Space Grotesk', sans-serif",
    bf: "'DM Mono', monospace",
    stroke: "rgba(56,189,248,0.5)",
    tbg: "rgba(56,189,248,0.07)",
    tc: "#38bdf8",
    r: "4px",
  },midnight: {
  name: "Midnight",
  dot: "#6366f1",
  bg: "#0b0f1a",
  surface: "#121826",
  card: "#1a2236",
  accent: "#818cf8",
  accentRgb: "129,140,248",
  text: "#e0e7ff",
  muted: "#6b7bbd",
  border: "rgba(129,140,248,0.12)",
  borderHover: "rgba(129,140,248,0.35)",
  hf: "'Space Grotesk', sans-serif",
  bf: "'DM Mono', monospace",
  stroke: "rgba(129,140,248,0.6)",
  tbg: "rgba(129,140,248,0.08)",
  tc: "#818cf8",
  r: "6px",
}
};

// ─── RESUME DATA ─────────────────────────────────────────────────────────────
const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "MySQL",
  "MongoDB",
  "Redux",
  "Socket.IO",
  "Redis",
  "Tailwind CSS",
  "SCSS",
  "Material-UI",
  "Strapi",
  "JWT Auth",
  "REST APIs",
];

const EXPERIENCE = [
  {
    company: "Fortune4 Technologies",
    title: "Software Developer",
    period: "Feb 2024 — Present",
    desc: "Worked with senior developers to implement new features and improve user experience based on client feedback. Active participant in Agile stand-ups and sprint cycles.",
    projects: [
      {
        name: "Titan Eye Plus & Fastrack Eyewear",
        bullets: [
          "Built mono-repo architecture with Next.js frontends and Node.js backends integrated with Magento services.",
          "Optimized Web Vitals (LCP, CLS, FID) via Redis caching and performance techniques.",
          "Built cross-device responsive UI components using SCSS.",
          "Wrote automation scripts for API testing and code quality.",
        ],
      },
      {
        name: "Runway Sunglasses — House of Titan",
        bullets: [
          "Designed modern, responsive UI using React.js, Next.js, and SASS.",
          "Developed backend services with Node.js and Redis caching.",
          "Ensured SEO optimization and cross-device compatibility.",
        ],
      },
      {
        name: "Frame Expert — In-Store Recommendation System",
        bullets: [
          "Built smart frame recommendation system for Titan Eye Plus outlets across India.",
          "Integrated VTO and IndiFit calculator for face dimension measurement.",
          "Implemented React Camera for face scanning and barcode identification.",
          "Enabled data management via Salesforce and SAP APIs.",
        ],
      },
    ],
  },
  {
    company: "Boppo Technologies",
    title: "Frontend Developer",
    period: "Jul 2022 — Dec 2023",
    desc: "Trained in Web Development with React.js and React Native. Maintained Next.js-based platform frontend. Participated in Git workflows, Agile stand-ups, sprint planning and retrospectives.",
    projects: [
      {
        name: "Bollywood MDB",
        bullets: [
          "Designed a news feed showcasing trending Bollywood news from reliable sources.",
          "Collaborated with cross-functional teams to gather requirements.",
          "Resolved front-end issues in coordination with backend developers.",
        ],
      },
      {
        name: "Insight GURU — Exam Portal Admin Panel",
        bullets: [
          "Developed responsive admin panel using React.js, Redux, and Material-UI.",
          "Integrated backend APIs to fetch and display relevant exam data.",
        ],
      },
    ],
  },
];

const PERSONAL_PROJECTS = [
  {
    num: "01",
    title: "Sports Tournament Management",
    url: "board.mardanisportsindia.org",
    href: "https://board.mardanisportsindia.org/",
    desc: "Real-time tournament platform with multi-referee score management, match history, and WebSocket.io live sync across devices.",
    tags: ["Next.js", "Socket.IO", "MySQL", "JWT", "Tailwind"],
  },
  {
    num: "02",
    title: "CargoDesk",
    url: "cargodesk.vercel.app",
    href: "https://cargodesk.vercel.app",
    desc: "Transport management for orders, invoices, vehicle docs. Bulk SMS via Twilio API and multi-source contact imports.",
    tags: ["Twilio", "MySQL", "JWT", "Material UI"],
  },
  {
    num: "03",
    title: "Linux Tools",
    url: "linux-support-manager.vercel.app",
    href: "https://linux-support-manager.vercel.app",
    desc: "DevOps toolkit — DNS checker, port scanner, IP lookup, Linux command library, JSON formatter, server diagnostics.",
    tags: ["Next.js", "DevOps", "Utilities"],
  },
  {
    num: "04",
    title: "Tic Tac Toe Game",
    url: "playtictac.vercel.app",
    href: "https://playtictac.vercel.app",
    desc: "Multiplayer game with glass-morphism UI, Single Player AI and real-time Online Multiplayer via Socket.IO with room matchmaking.",
    tags: ["Next.js", "TypeScript", "Socket.IO", "Tailwind"],
  },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function FadeSection({ children, style }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        transition: "opacity .6s ease, transform .6s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ t, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 40,
      }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: t.accent,
          fontFamily: t.bf,
          whiteSpace: "nowrap",
          transition: "color .4s",
        }}
      >
        {children}
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: t.border,
          transition: "background .4s",
        }}
      />
    </div>
  );
}

function SkillTag({ t, children }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "8px 16px",
        border: `1px solid ${hov ? t.borderHover : t.border}`,
        borderRadius: t.r,
        fontSize: 12,
        color: hov ? t.accent : t.muted,
        background: t.card,
        transition: "all .2s",
        cursor: "default",
        letterSpacing: 0.5,
        transform: hov ? "translateY(-2px)" : "none",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function ProjectCard({ t, name, bullets }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.card,
        border: `1px solid ${hov ? t.borderHover : t.border}`,
        borderRadius: t.r,
        padding: "20px 24px",
        position: "relative",
        overflow: "hidden",
        transition: "all .3s",
        transform: hov ? "translateX(5px)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: t.accent,
          opacity: hov ? 1 : 0,
          transition: "opacity .3s, background .4s",
        }}
      />
      <div
        style={{
          fontFamily: t.hf,
          fontSize: 14,
          fontWeight: 700,
          color: t.text,
          marginBottom: 10,
        }}
      >
        {name}
      </div>
      <ul style={{ listStyle: "none" }}>
        {bullets.map((b, i) => (
          <li
            key={i}
            style={{
              fontSize: 12,
              color: t.muted,
              paddingLeft: 14,
              position: "relative",
              lineHeight: 1.7,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                color: t.accent,
                fontSize: 10,
                top: 3,
              }}
            >
              →
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PersonalProjectCard({ t, item }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.card,
        border: `1px solid ${hov ? t.borderHover : t.border}`,
        borderRadius: t.r,
        padding: 24,
        transition: "all .3s",
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-3px)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `rgba(${t.accentRgb},0.04)`,
          transition: "transform .4s",
          transform: hov ? "scale(3)" : "scale(1)",
        }}
      />
      <div
        style={{
          fontSize: 10,
          letterSpacing: 3,
          color: t.accent,
          marginBottom: 10,
          opacity: 0.7,
        }}
      >
        {item.num}
      </div>
      <div
        style={{
          fontFamily: t.hf,
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 8,
          color: t.text,
        }}
      >
        {item.title}
      </div>
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          fontSize: 10,
          letterSpacing: 1,
          color: t.accent,
          textDecoration: "none",
          marginBottom: 12,
          opacity: 0.75,
        }}
      >
        {item.url} ↗
      </a>
      <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.7 }}>
        {item.desc}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
        {item.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 10,
              padding: "3px 8px",
              background: t.tbg,
              color: t.tc,
              borderRadius: 2,
              letterSpacing: 0.5,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ThemeSwitcher({ current, onChange, t }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: t.muted,
          fontFamily: t.bf,
        }}
      >
        Theme
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: t.r,
          padding: 6,
          boxShadow: "0 8px 32px rgba(0,0,0,.28)",
          transition: "all .4s",
        }}
      >
        {Object.entries(THEMES).map(([key, th]) => {
          const active = key === current;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                border: "none",
                borderRadius: 2,
                background: active
                  ? `rgba(${th.accentRgb},.13)`
                  : "transparent",
                cursor: "pointer",
                fontFamily: t.bf,
                fontSize: 11,
                color: active ? th.accent : t.muted,
                transition: "all .2s",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: th.dot,
                  border: key === "paper" ? "1px solid #ccc" : "none",
                  flexShrink: 0,
                }}
              />
              {th.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SurajResume() {
  const [themeKey, setThemeKey] = useState(() => {
    try {
      return localStorage.getItem("resume-theme") || "cyber";
    } catch {
      return "cyber";
    }
  });
  const t = THEMES[themeKey];

  const changeTheme = (key) => {
    setThemeKey(key);
    try {
      localStorage.setItem("resume-theme", key);
    } catch {}
  };

  const sectionStyle = {
    padding: "64px 0",
    borderBottom: `1px solid ${t.border}`,
    transition: "border-color .4s",
  };
  const contactLinks = [
    ["mailto:surajdsangale@gmail.com", "surajdsangale@gmail.com"],
    ["https://surajsangale.vercel.app", "surajsangale.vercel.app"],
    ["tel:+917039529129", "+91 703 95 29 129"],
    ["#", "Kamothe, Navi Mumbai"],
  ];

  return (
    <div
      style={{
        background: t.bg,
        color: t.text,
        fontFamily: t.bf,
        minHeight: "100vh",
        transition: "background .4s, color .4s",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Grain overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0.35,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "-10%",
          width: "60%",
          height: "60%",
          background: `radial-gradient(ellipse, rgba(${t.accentRgb},0.05) 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
          transition: "background .4s",
        }}
      />

      <ThemeSwitcher
        current={themeKey}
        onChange={changeTheme}
        t={t}
      />

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── HEADER ── */}
        <header
          style={{
            padding: "80px 0 60px",
            borderBottom: `1px solid ${t.border}`,
            position: "relative",
            overflow: "hidden",
            transition: "border-color .4s",
          }}
        >
          {/* BG monogram */}
          <div
            style={{
              position: "absolute",
              right: -20,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: t.hf,
              fontSize: "clamp(100px,18vw,200px)",
              fontWeight: 800,
              color: `rgba(${t.accentRgb},0.04)`,
              letterSpacing: -10,
              userSelect: "none",
              lineHeight: 1,
              transition: "all .4s",
            }}
          >
            SDS
          </div>

          <div
            style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: t.accent,
              marginBottom: 20,
              animation: "fadeUp .55s ease forwards",
              transition: "color .4s",
            }}
          >
            Portfolio · Resume · 2024
          </div>

          <h1
            style={{
              fontFamily: t.hf,
              fontSize: "clamp(36px,7vw,70px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <span style={{ color: t.text, transition: "color .4s" }}>
              Suraj Dnyandev
            </span>
            <span
              style={{
                display: "block",
                color: "transparent",
                WebkitTextStroke: `1px ${t.stroke}`,
                transition: "-webkit-text-stroke .4s",
              }}
            >
              Sangale
            </span>
          </h1>

          <p
            style={{
              marginTop: 18,
              color: t.muted,
              fontSize: 13,
              maxWidth: 440,
              transition: "color .4s",
            }}
          >
            Full-Stack JavaScript Developer · 3 years building scalable web apps
            with Next.js, React, Node.js &amp; real-time systems.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 32,
            }}
          >
            {contactLinks.map(([href, label]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                style={{
                  color: t.muted,
                  textDecoration: "none",
                  fontSize: 12,
                  letterSpacing: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "color .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = t.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = t.muted)}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: t.accent,
                    opacity: 0.7,
                    transition: "background .4s",
                  }}
                />
                {label}
              </a>
            ))}
          </div>
        </header>

        {/* ── SKILLS ── */}
        <FadeSection style={sectionStyle}>
          <SectionLabel t={t}>Technical Skills</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SKILLS.map((s) => (
              <SkillTag
                key={s}
                t={t}
              >
                {s}
              </SkillTag>
            ))}
          </div>
        </FadeSection>

        {/* ── EXPERIENCE ── */}
        <FadeSection style={sectionStyle}>
          <SectionLabel t={t}>Experience</SectionLabel>
          {EXPERIENCE.map((job) => (
            <div
              key={job.company}
              style={{ marginBottom: 52 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: t.accent,
                      letterSpacing: 1,
                      marginBottom: 4,
                      transition: "color .4s",
                    }}
                  >
                    {job.company}
                  </div>
                  <div
                    style={{
                      fontFamily: t.hf,
                      fontSize: 18,
                      fontWeight: 700,
                      color: t.text,
                      transition: "color .4s",
                    }}
                  >
                    {job.title}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: t.muted,
                    letterSpacing: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {job.period}
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: t.muted,
                  margin: "12px 0 20px",
                  lineHeight: 1.7,
                }}
              >
                {job.desc}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {job.projects.map((p) => (
                  <ProjectCard
                    key={p.name}
                    t={t}
                    {...p}
                  />
                ))}
              </div>
            </div>
          ))}
        </FadeSection>

        {/* ── PERSONAL PROJECTS ── */}
        <FadeSection style={sectionStyle}>
          <SectionLabel t={t}>Personal Projects</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {PERSONAL_PROJECTS.map((p) => (
              <PersonalProjectCard
                key={p.num}
                t={t}
                item={p}
              />
            ))}
          </div>
        </FadeSection>

        {/* ── EDUCATION ── */}
        <FadeSection style={sectionStyle}>
          <SectionLabel t={t}>Qualifications</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            {[
              {
                degree: "B.E — Electronics & Telecommunication",
                school: "Mumbai University",
                stat: "CGPA 7.35",
                year: "May 2022",
              },
              {
                degree: "HSC",
                school: "Maharashtra State Board",
                stat: "56.31%",
                year: "March 2017",
              },
            ].map((edu) => (
              <div
                key={edu.degree}
                style={{
                  background: t.card,
                  border: `1px solid ${t.border}`,
                  borderRadius: t.r,
                  padding: 24,
                  transition: "all .4s",
                }}
              >
                <div
                  style={{
                    fontFamily: t.hf,
                    fontSize: 15,
                    fontWeight: 700,
                    color: t.text,
                    marginBottom: 6,
                  }}
                >
                  {edu.degree}
                </div>
                <div style={{ fontSize: 12, color: t.muted, marginBottom: 12 }}>
                  {edu.school}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: t.accent,
                    fontWeight: 500,
                    transition: "color .4s",
                  }}
                >
                  {edu.stat}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: t.muted,
                    marginTop: 4,
                    letterSpacing: 1,
                  }}
                >
                  {edu.year}
                </div>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* ── HOBBIES ── */}
        <FadeSection style={{ padding: "64px 0" }}>
          <SectionLabel t={t}>Beyond Code</SectionLabel>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              ["🏊", "Swimming"],
              ["✏️", "Drawing"],
              ["📷", "Photography"],
            ].map(([icon, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: t.muted,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    transition: "all .4s",
                  }}
                >
                  {icon}
                </div>
                {label}
              </div>
            ))}
          </div>
        </FadeSection>
      </div>

      <footer
        style={{
          padding: "32px 0",
          textAlign: "center",
          fontSize: 11,
          color: t.muted,
          letterSpacing: 2,
          opacity: 0.45,
        }}
      >
        Suraj Dnyandev Sangale · Navi Mumbai, Maharashtra · 2024
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${t.bg}; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
      `}</style>
    </div>
  );
}
