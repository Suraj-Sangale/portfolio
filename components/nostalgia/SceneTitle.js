"use client";
import { AnimatePresence, motion } from "framer-motion";

const titleVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.25, duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export default function SceneTitle({ scene }) {
  return (
    <div className="nostalgia-hero" aria-live="polite" aria-label="Current scene">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          className="nostalgia-hero__inner"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h1
            className="nostalgia-hero__title"
            variants={titleVariants}
          >
            {scene.title}
          </motion.h1>
          <motion.p
            className="nostalgia-hero__subtitle"
            variants={subtitleVariants}
          >
            {scene.subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
