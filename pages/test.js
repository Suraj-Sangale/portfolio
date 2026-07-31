import { useEffect, useMemo, useRef, useState } from "react";

const SKILLS = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
];

// Ring colors matching devFolio's cyan / violet / magenta / amber / mint palette
const RING_COLORS = [
  "rgba(0, 245, 255, 0.18)",   // cyan   — innermost
  "rgba(116, 0, 255, 0.15)",   // violet
  "rgba(255, 0, 110, 0.15)",   // magenta
  "rgba(255, 190, 11, 0.12)",  // amber
  "rgba(6, 214, 160, 0.12)",   // mint   — outermost
];

// Radii/icon-size below are all defined at this "design" scale, then
// scaled down together to fit whatever width the container actually gets.
const BASE_CANVAS = 1300; // largest ring (600 * 2) + icon + breathing room
const BASE_ICON_SIZE = 52;

const CIRCLES = [
  { radius: 200, duration: 28 },
  { radius: 300, duration: 36 },
  { radius: 400, duration: 22 },
  { radius: 500, duration: 32 },
  { radius: 600, duration: 42 },
];

export default function TechStackAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);

  // Track the actual rendered width of the ring canvas so every radius,
  // the icon size, and the center label can scale together responsively.
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(BASE_CANVAS);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width) setCanvasSize(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = canvasSize / BASE_CANVAS;
  const iconSize = Math.max(BASE_ICON_SIZE * scale, 20);

  // Build orbit/skill layout deterministically split across circles.
  const orbits = useMemo(() => {
    const built = [];
    CIRCLES.forEach((circle, circleIndex) => {
      const iconsPerCircle = circleIndex + 3; // 3, 4, 5, 6, 7…
      for (let i = 0; i < iconsPerCircle; i++) {
        built.push({
          id: `${circleIndex}-${i}`,
          radius: circle.radius,
          angle: i * (360 / iconsPerCircle),
          duration: circle.duration,
          icon: SKILLS[(circleIndex * iconsPerCircle + i) % SKILLS.length],
          ringColor: RING_COLORS[circleIndex],
        });
      }
    });
    return built;
  }, []);

  return (
    <div className="tech-orbit-wrap">
      <style>{keyframesCSS}</style>

      {/* Square, fluid canvas: width tracks its parent, height matches via aspect-ratio */}
      <div ref={containerRef} className="tech-orbit-canvas">
        {/* Orbit rings — styled to match devFolio's subtle glow rings */}
        {[...CIRCLES].reverse().map((circle, i) => {
          const diameter = circle.radius * 2 * scale;
          const colorIdx = CIRCLES.length - 1 - i;
          return (
            <div
              key={`ring-${circle.radius}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: diameter,
                height: diameter,
                marginLeft: -diameter / 2,
                marginTop: -diameter / 2,
                border: `1px solid ${RING_COLORS[colorIdx]}`,
                borderRadius: "50%",
                boxShadow: `0 0 ${Math.round(20 * scale)}px ${RING_COLORS[colorIdx]}`,
              }}
            />
          );
        })}

        {/* Center badge — mirrors .orbit-center from devFolio */}
        <div
          className="tech-orbit-center"
          style={{
            width: Math.max(110 * scale, 48),
            height: Math.max(110 * scale, 48),
            fontSize: Math.max(14 * scale, 7),
          }}
        >
          FULL
          <br />
          STACK
        </div>

        {/* Orbiting icon wrappers */}
        {orbits.map((orbit) => {
          const radius = orbit.radius * scale;
          return (
            <div
              key={orbit.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: radius * 2,
                height: radius * 2,
                marginLeft: -radius,
                marginTop: -radius,
                "--start-angle": `${orbit.angle}deg`,
                animation: `tsa-spin ${orbit.duration}s linear infinite`,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            >
              <img
                src={orbit.icon}
                alt=""
                title=""
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: iconSize,
                  height: iconSize,
                  // Dark background to match devFolio's dark theme
                  background: "rgba(255, 255, 255, 1)",
                  borderRadius: "50%",
                  padding: Math.max(8 * scale, 3),
                  objectFit: "contain",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  boxShadow: `0 0 ${Math.round(14 * scale)}px rgba(0,0,0,0.6), 0 0 ${Math.round(8 * scale)}px ${orbit.ringColor}`,
                  "--start-angle": `${orbit.angle}deg`,
                  animation: `tsa-counter ${orbit.duration}s linear infinite`,
                  animationPlayState: isPlaying ? "running" : "paused",
                  transition: "box-shadow 0.3s",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scoped keyframe names (tsa-*) to avoid clashing with devFolio's spinRing
const keyframesCSS = `
  @keyframes tsa-spin {
    from { transform: rotate(var(--start-angle)); }
    to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
  }
  @keyframes tsa-counter {
    from { transform: translate(-50%, -50%) rotate(calc(-1 * var(--start-angle))); }
    to   { transform: translate(-50%, -50%) rotate(calc(-1 * var(--start-angle) - 360deg)); }
  }

  .tech-orbit-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tech-orbit-canvas {
    position: relative;
    width: 100%;
    max-width: ${BASE_CANVAS}px;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    margin: 0 auto;
    /* bento-style glass bg */
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(3px);
  }

  /* Center badge — mirrors .orbit-center styling from devFolio */
  .tech-orbit-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 245, 255, 0.15), rgba(116, 0, 255, 0.08));
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 245, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: 'Anton', sans-serif;
    letter-spacing: 0.15em;
    color: #00f5ff;
    text-shadow: 0 0 12px #00f5ff;
    z-index: 10;
    white-space: nowrap;
  }
`;
