"use client";
import { useState, useCallback, useEffect } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useScene } from "@/hooks/useScene";
import BackgroundScene from "./BackgroundScene";
import GrainOverlay from "./GrainOverlay";
import TopBar from "./TopBar";
import SceneTitle from "./SceneTitle";
import SceneNavigation from "./SceneNavigation";
import MusicPlayer from "./MusicPlayer";
import PlaylistPopup from "./PlaylistPopup";
import tracks from "@/data/tracks";

export default function NostalgiaExperience() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    isLoading,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    selectTrack,
  } = useAudioPlayer();

  // When scene changes, optionally cue the default track for that scene
  const handleSceneChange = useCallback(
    (scene) => {
      const sceneTrack = tracks.find((t) => t.id === scene.trackId);
      if (sceneTrack && sceneTrack.id !== currentTrack?.id) {
        selectTrack(sceneTrack.id);
      }
    },
    [currentTrack, selectTrack]
  );

  const { currentScene, currentIndex, isTransitioning, nextScene, prevScene, totalScenes } =
    useScene(handleSceneChange);

  // Keyboard: Space=play/pause, Escape=close playlist
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "Escape") setIsPlaylistOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [togglePlay]);

  const handleSelectTrack = useCallback(
    (id) => {
      selectTrack(id);
      // On mobile, close the popup after selection
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsPlaylistOpen(false);
      }
    },
    [selectTrack]
  );

  return (
    <main className="nostalgia-root" aria-label="Nostalgia Music Experience">
      {/* ── Layer 0: Cinematic Background ── */}
      <BackgroundScene scene={currentScene} isTransitioning={isTransitioning} />

      {/* ── Layer 1: Film Grain + Vignette ── */}
      <GrainOverlay />

      {/* ── Layer 2: Top Bar ── */}
      <TopBar />

      {/* ── Layer 3: Center Hero Title ── */}
      {/* <SceneTitle scene={currentScene} /> */}

      {/* ── Layer 4: Scene Navigation ── */}
      <SceneNavigation
        onNext={nextScene}
        onPrev={prevScene}
        currentIndex={currentIndex}
        total={totalScenes}
      />

      {/* ── Layer 5: Music Player ── */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isLoading={isLoading}
        onTogglePlay={togglePlay}
        onNext={next}
        onPrev={previous}
        onSeek={seek}
        onVolumeChange={setVolume}
        onPlaylistToggle={() => setIsPlaylistOpen((o) => !o)}
        isPlaylistOpen={isPlaylistOpen}
      />

      {/* ── Layer 6: Playlist Popup ── */}
      <PlaylistPopup
        isOpen={isPlaylistOpen}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
        onClose={() => setIsPlaylistOpen(false)}
      />
    </main>
  );
}
