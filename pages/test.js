import { useMemo, useState } from "react";

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

  // More
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

const CIRCLES = [
  { radius: 200, duration: 28 },
  { radius: 300, duration: 30 },
  { radius: 400, duration: 20 },
  { radius: 500, duration: 30 },
  { radius: 600, duration: 38 },
];

export default function TechStackAnimation() {
  // Animation is paused by default so icons sit exactly where they're
  // placed (matches the static layout). Hitting "Start" spins them
  // clockwise starting from that exact spot — no jump/snap.
  const [isPlaying, setIsPlaying] = useState(true);

  // Build the orbit/skill layout, deterministically split across circles
  // (mirrors the original script's index++ / count-per-circle logic).
  // Recomputes whenever CIRCLES itself changes (e.g. you edit a radius),
  // so icons always follow the CURRENT radius instead of a stale cached one.
  const orbits = useMemo(() => {
    const built = [];

    CIRCLES.forEach((circle, circleIndex) => {
      // const iconIndex = Math.floor(Math.random() * SKILLS.length);

      const iconsPerCircle = circleIndex + 3; // 1, 2, 3, 4, 5...

      for (let i = 0; i < iconsPerCircle; i++) {
        built.push({
          id: `${circleIndex}-${i}`,
          radius: circle.radius,
          angle: i * (360 / iconsPerCircle),
          duration: circle.duration,
          icon: SKILLS[(circleIndex * iconsPerCircle + i) % SKILLS.length],
        });
      }
    });

    return built;
  }, []);

  return (
    <div style={styles.body}>
      <style>{keyframesCSS}</style>

      {/*
      <div style={styles.controls}>
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          style={styles.button}
        >
          {isPlaying ? "Stop" : "Start"} Animation
        </button>
      </div>
      */}

      <div style={styles.container}>
        {[...CIRCLES].reverse().map((circle) => (
          <div
            key={`ring-${circle.radius}`}
            style={{
              ...styles.circle,
              width: circle.radius * 2,
              height: circle.radius * 2,
            }}
          />
        ))}

        <div style={styles.center}>Tech Stack</div>

        {orbits.map((orbit) => (
          <div
            key={orbit.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: orbit.radius * 2,
              height: orbit.radius * 2,
              marginLeft: -orbit.radius,
              marginTop: -orbit.radius,
              // Each ring item spins clockwise starting from ITS OWN fixed
              // angle (--start-angle), so at t=0 / when paused it sits
              // exactly where it's drawn today.
              "--start-angle": `${orbit.angle}deg`,
              animation: `spin ${orbit.duration}s linear infinite`,
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          >
            <img
              src={orbit.icon}
              alt=""
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: 52,
                height: 52,
                background: "white",
                borderRadius: "50%",
                padding: 8,
                objectFit: "contain",
                boxShadow: "0 5px 15px rgba(0,0,0,.18)",
                // Counter-rotates by the same amount so the icon artwork
                // itself always stays upright while its wrapper orbits.
                "--start-angle": `${orbit.angle}deg`,
                animation: `counter ${orbit.duration}s linear infinite`,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const keyframesCSS = `
  @keyframes spin {
    from { transform: rotate(var(--start-angle)); }
    to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
  }
  @keyframes counter {
    from { transform: translate(-50%, -50%) rotate(calc(-1 * var(--start-angle))); }
    to   { transform: translate(-50%, -50%) rotate(calc(-1 * var(--start-angle) - 360deg)); }
  }
`;

const styles = {
  body: {
    margin: "5rem",
    padding: "5rem",
    background: "#f5f5f5",
    fontFamily: "Arial, Helvetica, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    boxSizing: "border-box",
    gap: "1.5rem",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    padding: "0.65rem 1.5rem",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    background: "#1E88E5",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  container: {
    position: "relative",
    width: "95%",
    height: "90rem",
    overflow: "hidden",
    background: "white",
    border: "1px solid #ddd",
  },
  circle: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    border: "2px solid #1E88E5",
    borderRadius: "50%",
  },
  center: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 32,
    color: "#444",
    fontWeight: "bold",
    zIndex: 100,
  },
};
