"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-viewport cinematic background with:
 * - Slow Ken Burns zoom (20-30s)
 * - Cursor parallax (2-5px)
 * - Multi-layer overlays
 */
export default function BackgroundScene({ scene, isTransitioning }) {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const targetOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetOffset.current = {
        x: ((e.clientX - cx) / cx) * 5,
        y: ((e.clientY - cy) / cy) * 3,
      };
    };

    const animate = () => {
      setMouseOffset((prev) => ({
        x: prev.x + (targetOffset.current.x - prev.x) * 0.05,
        y: prev.y + (targetOffset.current.y - prev.y) * 0.05,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="nostalgia-bg" ref={containerRef} aria-hidden="true">
      {/* Cinematic background image with Ken Burns + parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          className="nostalgia-bg__image-wrap"
          style={{
            transform: `translate(${-mouseOffset.x}px, ${-mouseOffset.y}px)`,
          }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: isTransitioning ? 0 : 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="nostalgia-bg__ken-burns">
            <picture>
              {/* Mobile */}
              <source media="(max-width: 767px)" srcSet={scene.imageResponsive || scene.image} />
              <img
                src={scene.image}
                 fill
              priority
              quality={90}
                alt={scene.title}
                className="nostalgia-bg__image"
              style={{ objectFit: "cover", objectPosition: "center" }}

              />
            </picture>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Layer 1: Base dark gradient */}
      <div className="nostalgia-bg__gradient-base" />

      {/* Layer 2: Warm color wash — scene-specific accent */}
      <div
        className="nostalgia-bg__warm-wash"
        style={{ background: scene.accent }}
      />

      {/* Layer 3: Bottom shadow fade for player */}
      <div className="nostalgia-bg__bottom-fade" />

      {/* Layer 4: Top fade for TopBar */}
      <div className="nostalgia-bg__top-fade" />

      {/* Layer 5: Vignette */}
      <div className="nostalgia-bg__vignette" />
    </div>
  );
}
