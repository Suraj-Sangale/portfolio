import { useState, useEffect, useRef } from "react";

const ACCENT_WORDS = ["mit", "ezaix", "apple", "google"];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function Word({ text, isAccent, wordRef }) {
  return (
    <span
      ref={wordRef}
      data-accent={isAccent ? "true" : "false"}
      style={{
        display: "inline-block",
        color: "#2a2a2a",
        transition: "color 0.4s cubic-bezier(0.16,1,0.3,1)",
        marginRight: "0.28em",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

export default function ScrollReveal({ text, accentWords }) {
  const wordRefs = useRef([]);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const cursorPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const [scrollPct, setScrollPct] = useState(0);
  const [hintGone, setHintGone] = useState(false);
  const [footerHover, setFooterHover] = useState(false);

  const words = text.trim().split(/\s+/);

  // Main RAF loop
  useEffect(() => {
    const EASE = 0.09;
    const TRIGGER = 0.72; // word lights up when it crosses 72% from top

    const tick = () => {
      // Progress
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
      setScrollPct(Math.round(pct * 100));
      setHintGone(window.scrollY > 80);

      // Color each word based on its live viewport position
      const triggerY = window.innerHeight * TRIGGER;
      wordRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const wordMid = rect.top + rect.height / 2;
        const isAccent = el.dataset.accent === "true";

        if (wordMid < triggerY) {
          el.style.color = isAccent ? "#c8ff00" : "#f5f5f3";
        } else {
          el.style.color = "#2a2a2a";
        }
      });

      // Cursor ring lag
      ringPos.current.x = lerp(ringPos.current.x, cursorPos.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, cursorPos.current.y, 0.1);
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top = ringPos.current.y + "px";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Cursor dot (instant follow)
  useEffect(() => {
    const onMove = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="scollable">
      <style>{`
        
        @keyframes drop {
          0%   { transform: scaleY(0); transform-origin: top; }
          45%  { transform: scaleY(1); transform-origin: top; }
          55%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>

      {/* <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: 8,
          height: 8,
          background: "#c8ff00",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%,-50%)",
        }}
      />

      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: 34,
          height: 34,
          border: "1px solid rgba(200,255,0,0.3)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%,-50%)",
        }}
      /> */}

      {/* ── Page — normal scroll flow ── */}
      <div>
        {/* Top spacer */}

        {/* Text block — scrolls naturally with page */}
        <div style={{ padding: "0 60px", maxWidth: 920 }}>
          {/* <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "#333",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            — Introduction
          </div> */}

          <p
            style={{
              fontSize: "clamp(1.4rem, 3.2vw, 2.8rem)",
              fontWeight: 800,
              lineHeight: 1.35,
              letterSpacing: "-0.022em",
            }}
          >
            {words.map((w, i) => {
              const key = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
              return (
                <Word
                  key={i}
                  text={w}
                  isAccent={accentWords.includes(key)}
                  wordRef={(el) => {
                    wordRefs.current[i] = el;
                  }}
                />
              );
            })}
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 100,
          opacity: hintGone ? 0 : 1,
          transition: "opacity 0.5s",
          pointerEvents: "none",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <span
          style={{
            fontSize: "0.58rem",
            color: "#333",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(to bottom, #333, transparent)",
            animation: "drop 2s ease infinite",
          }}
        />
      </div>

      {/* Scroll % */}
      {/* <div
        style={{
          position: "fixed",
          right: 28,
          bottom: 28,
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          color: "#222",
          letterSpacing: "0.15em",
          zIndex: 100,
        }}
      >
        {String(scrollPct).padStart(2, "0")}%
      </div> */}
    </div>
  );
}
