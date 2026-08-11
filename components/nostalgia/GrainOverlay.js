"use client";
import { useEffect, useRef } from "react";

/**
 * Animated film grain + paper texture overlay.
 * Uses a canvas element for true random noise animation.
 * Respects prefers-reduced-motion.
 */
export default function GrainOverlay() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawGrain = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      // Sparse grain — only ~15% of pixels get noise
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.85) {
          const value = Math.random() * 60; // subtle brightness
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
          data[i + 3] = Math.random() * 28; // very low alpha
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    if (prefersReduced) {
      drawGrain(); // static frame only
      return;
    }

    let frame = 0;
    const animate = () => {
      frame++;
      // Update every 3 frames (~20fps) for subtlety
      if (frame % 3 === 0) drawGrain();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="nostalgia-grain"
      aria-hidden="true"
    />
  );
}
