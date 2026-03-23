import { useState, useEffect, useRef } from "react";

// ── Tool data ────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: 1,
    href: "tool/json_validator",
    accent: "var(--accent-2)",
    tags: ["data", "dev"],
    featured: true,
    icon: "{ }",
    tag: "Data · Dev",
    title: "JSON Validator & Formatter",
    desc: "Paste any JSON string and get instant validation, syntax-highlighted tree view, and auto-formatting. Catches errors with line-level hints.",
    badges: ["validate", "format", "minify"],
  },
  {
    id: 2,
    href: "locations",
    accent: "var(--accent-1)",
    tags: ["location"],
    icon: "📍",
    tag: "Location",
    title: "Location Tracker",
    desc: "Get your current coordinates, address, altitude, and accuracy — all in one tap. Works offline via GPS.",
    badges: ["GPS", "geocode"],
  },
  // {
  //   id: 3,
  //   href: "tools/color-picker.html",
  //   accent: "var(--accent-3)",
  //   tags: ["dev"],
  //   icon: "🎨",
  //   tag: "Dev · Design",
  //   title: "Color Converter",
  //   desc: "Convert between HEX, RGB, HSL, OKLCH instantly. Generate shades, tints, and complementary palettes.",
  //   badges: ["HEX", "HSL", "OKLCH"],
  // },
  {
    id: 4,
    href: "tool/base_64_coder",
    accent: "var(--accent-4)",
    tags: ["dev", "text"],
    icon: "🔐",
    tag: "Dev · Text ",
    title: "Base64 Encode / Decode",
    desc: "Encode any string or file to Base64 and decode it back. Handles UTF-8, files, and data URIs seamlessly.",
    badges: ["encode", "decode"],
  },
  // {
  //   id: 5,
  //   href: "tools/word-counter.html",
  //   accent: "var(--accent-5)",
  //   tags: ["text"],
  //   icon: "✍️",
  //   tag: "Text",
  //   title: "Word & Char Counter",
  //   desc: "Live character, word, sentence, and paragraph count with reading-time estimate. Great for tweets, bios, and SEO copy.",
  //   badges: ["words", "read time"],
  // },
  // {
  //   id: 6,
  //   href: "tools/timestamp.html",
  //   accent: "var(--accent-6)",
  //   tags: ["dev", "data"],
  //   icon: "🕐",
  //   tag: "Dev · Data",
  //   title: "Timestamp Converter",
  //   desc: "Convert Unix timestamps to human-readable dates and back. Supports local, UTC, and any IANA timezone.",
  //   badges: ["Unix", "UTC", "timezone"],
  // },
  // {
  //   id: 7,
  //   href: "tools/uuid.html",
  //   accent: "var(--accent-1)",
  //   tags: ["dev"],
  //   icon: "🔑",
  //   tag: "Dev",
  //   title: "UUID Generator",
  //   desc: "Generate v1, v4, or v5 UUIDs in bulk. One-click copy. Useful for database seeds and test fixtures.",
  //   badges: ["v4", "bulk"],
  // },
  {
    id: 8,
    href: "tool/regex_tester",
    accent: "var(--accent-2)",
    tags: ["dev", "text"],
    icon: "⚡",
    tag: "Dev · Text",
    title: "Regex Tester",
    desc: "Write, test, and debug regular expressions with live match highlighting, group capture view, and common pattern library.",
    badges: ["live", "groups", "flags"],
  },
];

const FILTERS = ["all", "data", "location", "text", "dev"];

// ── Styles (scoped via className prefix "qt-") ───────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  .qt-root {
    --bg:       #07080a;
    --surface:  #0f1115;
    --border:   rgba(255,255,255,0.06);
    --text:     #e8eaf0;
    --muted:    #636878;
    --accent-1: #00e5a0;
    --accent-2: #4d7cff;
    --accent-3: #ff6b6b;
    --accent-4: #f5c542;
    --accent-5: #b06aff;
    --accent-6: #ff9f5a;

    position: relative;
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* noise overlay */
  .qt-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* blobs */
  .qt-blobs {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0; overflow: hidden;
  }
  .qt-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.12;
    animation: qt-drift 18s ease-in-out infinite alternate;
  }
  .qt-blob-1 { width:600px; height:600px; background:var(--accent-1); top:-200px;  left:-200px; animation-delay:0s;   }
  .qt-blob-2 { width:500px; height:500px; background:var(--accent-2); bottom:-100px; right:-100px; animation-delay:-6s; }
  .qt-blob-3 { width:400px; height:400px; background:var(--accent-5); top:40%;    left:50%;   animation-delay:-12s; }

  @keyframes qt-drift {
    0%   { transform: translate(0,0)      scale(1);    }
    50%  { transform: translate(40px,-30px) scale(1.05); }
    100% { transform: translate(-20px,20px) scale(0.95); }
  }

  /* cursor dot */
  .qt-cursor {
    position: fixed;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-1);
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    transform: translate(-50%, -50%);
    transition: opacity .3s;
  }

  /* wrapper */
  .qt-wrapper {
    position: relative; z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 100px 32px 120px;
  }

  /* section label */
  .qt-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
    color: var(--accent-1);
    margin-bottom: 24px;
    opacity: 0; animation: qt-fadeUp .6s .1s forwards;
  }
  .qt-label::before {
    content: ''; display: block;
    width: 28px; height: 1px;
    background: var(--accent-1);
  }

  /* title */
  .qt-title {
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 800; line-height: .95; letter-spacing: -.03em;
    opacity: 0; animation: qt-fadeUp .6s .2s forwards;
  }
  .qt-title em {
    font-style: normal;
    -webkit-text-stroke: 1.5px var(--text);
    color: transparent;
  }

  /* intro */
  .qt-intro {
    max-width: 520px; margin-top: 28px;
    font-size: 16px; line-height: 1.7;
    color: var(--muted);
    font-family: 'DM Mono', monospace; font-weight: 300;
    opacity: 0; animation: qt-fadeUp .6s .35s forwards;
  }
  .qt-intro strong { color: var(--text); font-weight: 400; }

  /* stats */
  .qt-stats {
    display: flex; gap: 40px;
    margin-top: 44px; padding-top: 32px;
    border-top: 1px solid var(--border);
    opacity: 0; animation: qt-fadeUp .6s .45s forwards;
  }
  .qt-stat-num { font-size: 28px; font-weight: 700; color: var(--text); }
  .qt-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .1em;
    color: var(--muted); text-transform: uppercase; margin-top: 2px;
  }

  /* filters */
  .qt-filters {
    display: flex; gap: 10px; flex-wrap: wrap;
    margin-top: 56px;
    opacity: 0; animation: qt-fadeUp .6s .55s forwards;
  }
  .qt-pill {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
    padding: 7px 18px; border-radius: 100px;
    border: 1px solid var(--border);
    color: var(--muted); cursor: pointer;
    transition: all .25s; background: transparent;
  }
  .qt-pill:hover, .qt-pill.active {
    color: var(--bg);
    background: var(--text);
    border-color: var(--text);
  }

  /* grid */
  .qt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 40px;
  }

  /* card */
  .qt-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    display: flex; flex-direction: column;
    overflow: hidden;
    transition: transform .35s cubic-bezier(.2,.8,.2,1), border-color .35s, box-shadow .35s, opacity .3s;
    opacity: 0;
    animation: qt-cardIn .5s forwards;
  }
  .qt-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 60px rgba(0,0,0,.5);
  }
  .qt-card.filtered-out {
    opacity: 0.15 !important;
    transform: scale(0.97) !important;
    pointer-events: none;
  }

  /* top accent line */
  .qt-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--card-accent);
    transform: scaleX(0); transform-origin: left;
    transition: transform .4s cubic-bezier(.2,.8,.2,1);
  }
  .qt-card:hover::before { transform: scaleX(1); }

  /* glow */
  .qt-card::after {
    content: '';
    position: absolute; inset: 0; border-radius: 20px;
    background: radial-gradient(circle at var(--mx,50%) var(--my,50%), var(--card-accent), transparent 65%);
    opacity: 0; transition: opacity .4s; pointer-events: none;
  }
  .qt-card:hover::after { opacity: .06; }

  /* staggered entry */
  .qt-card:nth-child(1){animation-delay:.60s}
  .qt-card:nth-child(2){animation-delay:.70s}
  .qt-card:nth-child(3){animation-delay:.80s}
  .qt-card:nth-child(4){animation-delay:.90s}
  .qt-card:nth-child(5){animation-delay:1.00s}
  .qt-card:nth-child(6){animation-delay:1.10s}
  .qt-card:nth-child(7){animation-delay:1.15s}
  .qt-card:nth-child(8){animation-delay:1.20s}

  @keyframes qt-cardIn {
    from { opacity:0; transform: translateY(30px) scale(.97); }
    to   { opacity:1; transform: translateY(0)    scale(1);   }
  }

  /* icon */
  .qt-card-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: color-mix(in srgb, var(--card-accent) 14%, transparent);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 24px;
    transition: transform .3s, background .3s;
  }
  .qt-card:hover .qt-card-icon {
    transform: scale(1.12) rotate(-4deg);
    background: color-mix(in srgb, var(--card-accent) 22%, transparent);
  }

  /* tag */
  .qt-card-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
    color: var(--card-accent); margin-bottom: 10px;
  }

  /* card title */
  .qt-card-title {
    font-size: 20px; font-weight: 700; line-height: 1.2;
    margin-bottom: 12px; transition: color .2s;
  }
  .qt-card:hover .qt-card-title { color: var(--card-accent); }

  /* card desc */
  .qt-card-desc {
    font-family: 'DM Mono', monospace;
    font-size: 13px; line-height: 1.65;
    color: var(--muted); font-weight: 300; flex: 1;
  }

  /* footer */
  .qt-card-footer {
    margin-top: 28px; padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .qt-badges { display: flex; gap: 6px; flex-wrap: wrap; }
  .qt-badge {
    font-family: 'DM Mono', monospace;
    font-size: 10px; padding: 4px 10px; border-radius: 100px;
    border: 1px solid var(--border); color: var(--muted);
  }
  .qt-arrow {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 14px; flex-shrink: 0;
    transition: all .3s;
  }
  .qt-card:hover .qt-arrow {
    background: var(--card-accent);
    border-color: var(--card-accent);
    color: var(--bg);
    transform: rotate(45deg);
  }

  /* featured card */
  .qt-card.qt-featured {
    grid-column: span 2;
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
    padding: 40px;
  }
  .qt-card.qt-featured .qt-card-icon {
    width: 64px; height: 64px; font-size: 28px;
    border-radius: 16px; flex-shrink: 0;
    margin-bottom: 0; margin-top: 4px;
  }
  .qt-card.qt-featured .qt-card-content { flex: 1; }
  .qt-card.qt-featured .qt-card-title { font-size: 26px; }

  /* animations */
  @keyframes qt-fadeUp {
    from { opacity:0; transform: translateY(20px); }
    to   { opacity:1; transform: translateY(0);    }
  }

  /* responsive */
  @media (max-width: 680px) {
    .qt-card.qt-featured { grid-column: span 1; flex-direction: column; }
    .qt-stats { gap: 24px; }
  }
`;

// ── Sub-components ────────────────────────────────────────────────────────────

function ToolCard({ tool, visible }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
    const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  const baseClass = [
    "qt-card",
    tool.featured ? "qt-featured" : "",
    !visible ? "filtered-out" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const badges = (
    <div className="qt-badges">
      {tool.badges.map((b) => (
        <span
          key={b}
          className="qt-badge"
        >
          {b}
        </span>
      ))}
    </div>
  );

  if (tool.featured) {
    return (
      <a
        ref={cardRef}
        href={tool.href}
        className={baseClass}
        style={{ "--card-accent": tool.accent }}
        onMouseMove={handleMouseMove}
      >
        <div className="qt-card-icon">{tool.icon}</div>
        <div className="qt-card-content">
          <div className="qt-card-tag">{tool.tag}</div>
          <div className="qt-card-title">{tool.title}</div>
          <div className="qt-card-desc">{tool.desc}</div>
          <div className="qt-card-footer">
            {badges}
            <div className="qt-arrow">↗</div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      ref={cardRef}
      href={tool.href}
      className={baseClass}
      style={{ "--card-accent": tool.accent }}
      onMouseMove={handleMouseMove}
    >
      <div className="qt-card-icon">{tool.icon}</div>
      <div className="qt-card-tag">{tool.tag}</div>
      <div className="qt-card-title">{tool.title}</div>
      <div className="qt-card-desc">{tool.desc}</div>
      <div className="qt-card-footer">
        {badges}
        <div className="qt-arrow">↗</div>
      </div>
    </a>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function QuickToolsWrapper() {
  const [activeFilter, setActiveFilter] = useState("all");
  const cursorRef = useRef(null);

  // cursor dot
  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  const isVisible = (tool) =>
    activeFilter === "all" || tool.tags.includes(activeFilter);

  return (
    <>
      {/* inject scoped styles once */}
      <style>{styles}</style>

      <div className="qt-root">
        {/* ambient blobs */}
        <div className="qt-blobs">
          <div className="qt-blob qt-blob-1" />
          <div className="qt-blob qt-blob-2" />
          <div className="qt-blob qt-blob-3" />
        </div>

        {/* cursor dot */}
        <div
          className="qt-cursor"
          ref={cursorRef}
        />

        <div className="qt-wrapper">
          {/* header */}
          <div className="qt-label">Utilities · Collection</div>

          <h1 className="qt-title">
            Micro
            <br />
            <em>Tools</em>
          </h1>

          <p className="qt-intro">
            A curated set of <strong>tiny, focused utilities</strong> I built
            for myself — and now share with anyone who needs them. No bloat. No
            sign-ups. Just open and use.
          </p>

          {/* stats */}
          <div className="qt-stats">
            <div>
              <div className="qt-stat-num">8</div>
              <div className="qt-stat-label">Tools</div>
            </div>
            <div>
              <div className="qt-stat-num">0</div>
              <div className="qt-stat-label">Sign-ups needed</div>
            </div>
            <div>
              <div className="qt-stat-num">100%</div>
              <div className="qt-stat-label">Free forever</div>
            </div>
          </div>

          {/* filter pills */}
          <div className="qt-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`qt-pill${activeFilter === f ? " active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* grid */}
          <div className="qt-grid">
            {TOOLS.map((tool, i) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={i}
                visible={isVisible(tool)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
