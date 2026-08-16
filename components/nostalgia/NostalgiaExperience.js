"use client";
import { useState, useCallback, useEffect } from "react";
import { useScene } from "@/hooks/useScene";
import BackgroundScene from "./BackgroundScene";
import GrainOverlay from "./GrainOverlay";
import TopBar from "./TopBar";
import SceneNavigation from "./SceneNavigation";
import EmbedPlayer from "./EmbedPlayer";
import SceneTitle from "./SceneTitle";
import MusicPlayer from "./MusicPlayer";

export default function NostalgiaExperience({ tracks }) {
  const [embedPlatform, setEmbedPlatform] = useState(null);
  const [embedTrack, setEmbedTrack] = useState(null);

  const { currentScene, currentIndex, isTransitioning, nextScene, prevScene, totalScenes } =
    useScene();

  const handleEmbedSwitch = useCallback((platform) => {
    setEmbedPlatform(platform);
  }, []);

  const handleEmbedClose = useCallback(() => {
    setEmbedPlatform(null);
    setEmbedTrack(null);
  }, []);

  return (
    <main className="nostalgia-root" aria-label="Nostalgia Music Experience">
      {/* ── Layer 0: Cinematic Background ── */}
      <BackgroundScene scene={currentScene} isTransitioning={isTransitioning} />

      {/* ── Layer 1: Film Grain + Vignette ── */}
      <GrainOverlay />

      {/* ── Layer 2: Top Bar ── */}
      <TopBar />

      {/* ── Layer 3: Center Hero Title ── */}
      <SceneTitle scene={currentScene} />

      {/* ── Layer 4: Scene Navigation ── */}
      <SceneNavigation
        onNext={nextScene}
        onPrev={prevScene}
        currentIndex={currentIndex}
        total={totalScenes}
      />

      {/* ── Layer 5: Music Player (self-contained with YouTube IFrame API) ── */}
      <MusicPlayer tracks={tracks} />

      {/* ── Layer 6: Embed Player (Spotify / YouTube) ── */}
      <EmbedPlayer
        track={embedTrack}
        platform={embedPlatform}
        onClose={handleEmbedClose}
        onSwitch={handleEmbedSwitch}
      />
    </main>
  );
}
