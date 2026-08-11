"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SceneNavigation({
  onNext,
  onPrev,
  currentIndex,
  total,
}) {
  return (
    <div className="nostalgia-scenenav" aria-label="Scene navigation">
      {/* Prev */}
      <motion.button
        className="nostalgia-scenenav__btn nostalgia-scenenav__btn--prev glass-pill"
        onClick={onPrev}
        aria-label="Previous scene"
        whileHover={{ x: -3, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <ChevronLeft size={14} />
        <span>PREV</span>
      </motion.button>

      {/* Dot indicators */}
      <div className="nostalgia-scenenav__dots" aria-label={`Scene ${currentIndex + 1} of ${total}`}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`nostalgia-scenenav__dot ${i === currentIndex ? "nostalgia-scenenav__dot--active" : ""}`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Next */}
      <motion.button
        className="nostalgia-scenenav__btn nostalgia-scenenav__btn--next glass-pill"
        onClick={onNext}
        aria-label="Next scene"
        whileHover={{ x: 3, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <span>NEXT</span>
        <ChevronRight size={14} />
      </motion.button>
    </div>
  );
}
