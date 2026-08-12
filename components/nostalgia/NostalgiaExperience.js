"use client";
import { useState, useCallback, useEffect } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useScene } from "@/hooks/useScene";
import BackgroundScene from "./BackgroundScene";
import GrainOverlay from "./GrainOverlay";
import TopBar from "./TopBar";
import SceneNavigation from "./SceneNavigation";
import MusicPlayer from "./MusicPlayer";
import PlaylistPopup from "./PlaylistPopup";
import EmbedPlayer from "./EmbedPlayer";
import tracks from "@/data/tracks";
import SceneTitle from "./SceneTitle";

export default function NostalgiaExperience() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  /**
   * embedPlatform: null | 'spotify' | 'youtube'
   * embedTrack: the track object currently loaded in the embed panel
   *
   * When null → panel closed.
   * Toggling the same platform again closes the panel.
   */
  const [embedPlatform, setEmbedPlatform] = useState(null);
  const [embedTrack, setEmbedTrack] = useState(null);

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

  // When current track changes, sync the embed panel track
  useEffect(() => {
    if (embedPlatform && currentTrack) {
      setEmbedTrack(currentTrack);
    }
  }, [currentTrack, embedPlatform]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "Escape") {
        setIsPlaylistOpen(false);
        setEmbedPlatform(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [togglePlay]);

  const handleSelectTrack = useCallback(
    (id) => {
      selectTrack(id);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsPlaylistOpen(false);
      }
    },
    [selectTrack]
  );

  /** Open embed panel from the MusicPlayer bar buttons */
  const handleEmbedToggle = useCallback(
    (platform) => {
      setEmbedTrack(currentTrack);
      setEmbedPlatform((prev) => (prev === platform ? null : platform));
    },
    [currentTrack]
  );

  /**
   * Open embed panel from a specific PlaylistItem's icon button.
   * Also selects that track in the local audio player.
   */
  const handleStreamSpotify = useCallback(
    (track) => {
      selectTrack(track.id);
      setEmbedTrack(track);
      setEmbedPlatform((prev) => (prev === "spotify" && embedTrack?.id === track.id ? null : "spotify"));
    },
    [selectTrack, embedTrack]
  );

  const handleStreamYoutube = useCallback(
    (track) => {
      selectTrack(track.id);
      setEmbedTrack(track);
      setEmbedPlatform((prev) => (prev === "youtube" && embedTrack?.id === track.id ? null : "youtube"));
    },
    [selectTrack, embedTrack]
  );

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

      {/* ── Layer 4: Music Player ── */}
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
        embedPlatform={embedPlatform}
        onSpotify={() => handleEmbedToggle("spotify")}
        onYoutube={() => handleEmbedToggle("youtube")}
      />

      {/* ── Layer 5: Embed Player (Spotify / YouTube) ── */}
      <EmbedPlayer
        track={embedTrack || currentTrack}
        platform={embedPlatform}
        onClose={handleEmbedClose}
        onSwitch={handleEmbedSwitch}
      />

      {/* ── Layer 6: Playlist Popup ── */}
      <PlaylistPopup
        isOpen={isPlaylistOpen}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
        onClose={() => setIsPlaylistOpen(false)}
        onStreamSpotify={handleStreamSpotify}
        onStreamYoutube={handleStreamYoutube}
      />
    </main>
  );
}
