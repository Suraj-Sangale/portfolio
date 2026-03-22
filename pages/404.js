import { useEffect, useRef } from "react";

export default function Cradle404() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let W, H, BALL_R, ROPE_LEN, BALL_SPACING;
    let pivots = [], balls = [];

    const LABELS = [
      { top: "OOOPS", digit: "4", bottom: "WE'RE SORRY" },
      { top: "PAGE NOT", digit: "0", bottom: "FOUND" },
      { top: "SOMETHING", digit: "4", bottom: "IS BROKEN" },
    ];

    const N = 3;

    function calcSizes() {
      const vw = Math.min(window.innerWidth * 0.92, 860);
      const vh = Math.min(window.innerHeight * 0.52, 380);

      W = vw; H = vh;

      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      canvas.width = W * DPR;
      canvas.height = H * DPR;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      BALL_R = Math.min(W * 0.13, 88);
      BALL_SPACING = BALL_R * 2 + 6;
      ROPE_LEN = H * 0.42;
    }

    function initPendulums() {
      pivots = [];
      balls = [];

      const totalW = BALL_SPACING * (N - 1);
      const startX = W / 2 - totalW / 2;
      const pivotY = H * 0.08;

      for (let i = 0; i < N; i++) {
        pivots.push({ x: startX + i * BALL_SPACING, y: pivotY });
        balls.push({ angle: 0, vel: 0, dragging: false, trail: [] });
      }

      balls[0].angle = -Math.PI / 3.8;
    }

    const GRAVITY = 900;
    const DAMPING = 0.9988;
    const DT = 1 / 60;

    function ballXY(i) {
      return {
        x: pivots[i].x + Math.sin(balls[i].angle) * ROPE_LEN,
        y: pivots[i].y + Math.cos(balls[i].angle) * ROPE_LEN,
      };
    }

    function collide() {
      for (let i = 0; i < N - 1; i++) {
        const a = ballXY(i);
        const b = ballXY(i + 1);

        if (b.x - a.x < BALL_R * 2 - 1) {
          const va = balls[i].vel;
          const vb = balls[i + 1].vel;

          balls[i].vel = vb;
          balls[i + 1].vel = va;
        }
      }
    }

    function update() {
      for (let i = 0; i < N; i++) {
        if (balls[i].dragging) continue;

        const acc = -(GRAVITY / ROPE_LEN) * Math.sin(balls[i].angle);
        balls[i].vel = (balls[i].vel + acc * DT) * DAMPING;
        balls[i].angle += balls[i].vel * DT;
      }
      collide();
    }

    function drawBall(i) {
      const { x, y } = ballXY(i);
      const lab = LABELS[i];

      ctx.beginPath();
      ctx.arc(x, y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20,16,36,0.6)";
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = "center";

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = `${BALL_R * 0.15}px sans-serif`;
      ctx.fillText(lab.top, x, y - BALL_R * 0.5);

      ctx.fillStyle = "white";
      ctx.font = `${BALL_R * 0.7}px sans-serif`;
      ctx.fillText(lab.digit, x, y + BALL_R * 0.2);

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = `${BALL_R * 0.15}px sans-serif`;
      ctx.fillText(lab.bottom, x, y + BALL_R * 0.6);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        const pos = ballXY(i);

        ctx.beginPath();
        ctx.moveTo(pivots[i].x, pivots[i].y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();

        drawBall(i);
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    calcSizes();
    initPendulums();
    loop();

    window.addEventListener("resize", () => {
      calcSizes();
      initPendulums();
    });

  }, []);

  return (
    <div style={styles.wrapper}>
      <canvas ref={canvasRef} />
      <div style={styles.text}>
        <h2>Oops — we couldn't find that page</h2>
        <p>The link may be broken or removed</p>
        <a href="/" style={styles.btn}>← Return Home</a>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    background: "#0b0b10",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  text: {
    marginTop: "40px",
    textAlign: "center",
    opacity: 0.8,
  },
  btn: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 20px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "999px",
    color: "white",
    textDecoration: "none",
  },
};