import { useState, useCallback } from "react";

const CX = 180;
const DOT = 22;

const COLOR_MAP = {
  React: { bg: "#E6F1FB", color: "#0C447C", border: "#85B7EB" },
  Next:  { bg: "#EEEDFE", color: "#3C3489", border: "#AFA9EC" },
  Node:  { bg: "#EAF3DE", color: "#27500A", border: "#97C459" },
  JS:    { bg: "#FAEEDA", color: "#633806", border: "#EF9F27" },
  TS:    { bg: "#E6F1FB", color: "#185FA5", border: "#378ADD" },
  Mongo: { bg: "#EAF3DE", color: "#3B6D11", border: "#97C459" },
  PG:    { bg: "#E6F1FB", color: "#0C447C", border: "#85B7EB" },
  Redis: { bg: "#FAECE7", color: "#712B13", border: "#F0997B" },
};

const INITIAL_TECHS = [
  { label: "React", r: 130, angle: 180 },
  { label: "Next",  r: 130, angle: 252 },
  { label: "Node",  r: 130, angle: 324 },
  { label: "JS",    r: 130, angle: 36  },
  { label: "TS",    r: 130, angle: 108 },
  { label: "Mongo", r: 80,  angle: 200 },
  { label: "PG",    r: 80,  angle: 320 },
  { label: "Redis", r: 80,  angle: 80  },
];

function getPos(r, angle) {
  const rad = (angle * Math.PI) / 180;
  return {
    left: CX + Math.cos(rad) * r - DOT,
    top:  CX + Math.sin(rad) * r - DOT,
  };
}

export default function TechOrbitPlayground() {
  const [techs, setTechs] = useState(INITIAL_TECHS);
  const [copied, setCopied] = useState(false);

  const update = useCallback((index, key, value) => {
    setTechs((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [key]: Number(value) } : t))
    );
  }, []);

  const codeOutput = `const techs = [\n${techs
    .map((t) => `  { label: "${t.label}", r: ${t.r}, angle: ${t.angle} },`)
    .join("\n")}\n];`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ fontFamily: "sans-serif", display: "flex", gap: 32, flexWrap: "wrap", padding: "1rem 0" }}>

      {/* ORBIT PREVIEW */}
      <div style={{ position: "relative", width: 360, height: 360, flexShrink: 0 }}>
        {[260, 160, 80].map((size) => (
          <div
            key={size}
            style={{
              position: "absolute",
              width: size,
              height: size,
              left: (360 - size) / 2,
              top: (360 - size) / 2,
              borderRadius: "50%",
              border: "0.5px solid #ccc",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#f5f5f5",
            border: "0.5px solid #ddd",
            left: 145,
            top: 145,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: "#555",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          FULL<br />STACK
        </div>
        {techs.map((t) => {
          const { left, top } = getPos(t.r, t.angle);
          const c = COLOR_MAP[t.label] || { bg: "#eee", color: "#333", border: "#aaa" };
          return (
            <div
              key={t.label}
              style={{
                position: "absolute",
                left,
                top,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.color,
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 0.15s, top 0.15s",
              }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      {/* CONTROLS + CODE */}
      <div style={{ flex: 1, minWidth: 260 }}>
        {/* Sliders */}
        <div style={{ marginBottom: 16 }}>
          {techs.map((t, i) => {
            const c = COLOR_MAP[t.label] || { color: "#333" };
            return (
              <div
                key={t.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 0",
                  borderBottom: "0.5px solid #eee",
                }}
              >
                <span style={{ width: 44, fontSize: 12, fontWeight: 600, color: c.color }}>
                  {t.label}
                </span>

                <span style={{ fontSize: 10, color: "#999", width: 10 }}>r</span>
                <input
                  type="range"
                  min={40}
                  max={160}
                  step={1}
                  value={t.r}
                  onChange={(e) => update(i, "r", e.target.value)}
                  style={{ width: 80 }}
                />
                <span style={{ fontSize: 11, color: "#666", width: 28, textAlign: "right" }}>
                  {t.r}
                </span>

                <span style={{ fontSize: 10, color: "#999", width: 14 }}>°</span>
                <input
                  type="range"
                  min={0}
                  max={359}
                  step={1}
                  value={t.angle}
                  onChange={(e) => update(i, "angle", e.target.value)}
                  style={{ width: 80 }}
                />
                <span style={{ fontSize: 11, color: "#666", width: 32, textAlign: "right" }}>
                  {t.angle}°
                </span>
              </div>
            );
          })}
        </div>

        {/* Code output */}
        {/* <pre
          style={{
            background: "#f7f7f7",
            border: "0.5px solid #ddd",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 11,
            fontFamily: "monospace",
            lineHeight: 1.7,
            overflowX: "auto",
            margin: 0,
          }}
        >
          {codeOutput}
        </pre> */}
        {/* <button
          onClick={handleCopy}
          style={{
            marginTop: 8,
            fontSize: 12,
            padding: "4px 12px",
            borderRadius: 8,
            border: "0.5px solid #ccc",
            background: "transparent",
            cursor: "pointer",
            color: "#555",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button> */}
      </div>
    </div>
  );
}