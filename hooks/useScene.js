import { useState, useEffect, useCallback, useRef } from "react";
import { scenes } from "@/data/scenes";

/**
 * Manages the active scene + cinematic transition state.
 * @param {Function} onSceneChange - optional callback when scene changes
 */
export function useScene(onSceneChange) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef(null);

  const currentScene = scenes[currentIndex];

  const goToScene = useCallback(
    (index) => {
      if (isTransitioning) return;
      const target = ((index % scenes.length) + scenes.length) % scenes.length;
      setIsTransitioning(true);
      clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => {
        setCurrentIndex(target);
        setIsTransitioning(false);
        onSceneChange?.(scenes[target]);
      }, 400); // half of total transition time
    },
    [isTransitioning, onSceneChange]
  );

  const nextScene = useCallback(() => goToScene(currentIndex + 1), [currentIndex, goToScene]);
  const prevScene = useCallback(() => goToScene(currentIndex - 1), [currentIndex, goToScene]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") nextScene();
      if (e.key === "ArrowLeft") prevScene();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextScene, prevScene]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(transitionTimeout.current), []);

  return {
    currentScene,
    currentIndex,
    isTransitioning,
    nextScene,
    prevScene,
    goToScene,
    totalScenes: scenes.length,
  };
}
