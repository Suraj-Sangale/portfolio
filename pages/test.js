import { useMemo } from 'react';

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
];

const CIRCLES = [
  { radius: 250, duration: 18 },
  { radius: 400, duration: 24 },
  { radius: 550, duration: 30 },
  { radius: 700, duration: 36 },
];

export default function TechStackAnimation() {
  // Build the orbit/skill layout, deterministically split across circles
  // (mirrors the original script's index++ / count-per-circle logic).
  // Recomputes whenever CIRCLES itself changes (e.g. you edit a radius),
  // so icons always follow the CURRENT radius instead of a stale cached one.
  const orbits = useMemo(() => {
    const built = [];
    let index = 0;

    CIRCLES.forEach((circle, circleIndex) => {
      const count = Math.ceil(SKILLS.length / CIRCLES.length);
      for (let i = 0; i < count && index < SKILLS.length; i++) {
        built.push({
          id: `orbit-${index}`,
          radius: circle.radius,
          duration: circle.duration,
          angle: i * (360 / count),
          // Deterministic (not Math.random) so re-renders never flip
          // direction mid-animation or cause a jump/reset.
          reverse: (circleIndex + i) % 2 === 0,
          icon: SKILLS[index],
        });
        index++;
      }
    });

    return built;
  }, [CIRCLES, SKILLS]);

  return (
    <div style={styles.body}>
      <style>{keyframesCSS}</style>
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
              position: 'absolute',
              left: '50%',
              top: '50%',
              transformOrigin: 'center center',
              width: orbit.radius * 2,
              height: orbit.radius * 2,
              marginLeft: -orbit.radius,
              marginTop: -orbit.radius,
              transform: `rotate(${orbit.angle}deg)`,
              animation: `spin ${orbit.duration}s linear infinite`,
              animationDirection: orbit.reverse ? 'reverse' : 'normal',
            }}
          >
            <img
              src={orbit.icon}
              alt=""
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: 52,
                height: 52,
                transform: 'translate(-50%, -50%)',
                background: 'white',
                borderRadius: '50%',
                padding: 8,
                objectFit: 'contain',
                boxShadow: '0 5px 15px rgba(0,0,0,.18)',
                animation: `counter ${orbit.duration}s linear infinite`,
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
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes counter {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(-360deg); }
  }
`;

const styles = {
  body: {
    margin:"5rem",padding: "5rem",
    background: '#f5f5f5',
    fontFamily: 'Arial, Helvetica, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    boxSizing: 'border-box',
  },
  container: {
    position: 'relative',
    width: '95%',
    height: '30rem',
    overflow: 'hidden',
    background: 'white',
    border: '1px solid #ddd',
  },
  circle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #1E88E5',
    borderRadius: '50%',
  },
  center: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 32,
    color: '#444',
    fontWeight: 'bold',
    zIndex: 100,
  },
};