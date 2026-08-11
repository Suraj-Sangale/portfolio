import { useState, useEffect, useRef, useCallback } from "react";
import tracks from "@/data/tracks";

/**
 * Custom hook for HTML5 Audio playback.
 *
 * FIXES applied:
 * 1. selectTrack now ALWAYS plays after selection (old code had inverted condition)
 * 2. Initial track src is set on mount so first Play click works immediately
 * 3. Track-change useEffect correctly resumes play if was already playing
 * 4. pendingPlay ref prevents race conditions between index state + src load
 */
export function useAudioPlayer() {
  const audioRef    = useRef(null);
  const pendingPlay = useRef(false); // want to play as soon as src is ready

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying,         setIsPlaying]         = useState(false);
  const [currentTime,       setCurrentTime]        = useState(0);
  const [duration,          setDuration]           = useState(0);
  const [volume,            setVolumeState]        = useState(0.8);
  const [isLoading,         setIsLoading]          = useState(false);
  const [hasError,          setHasError]           = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  // ── Bootstrap the Audio element ONCE ───────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.preload  = "metadata";
    audio.volume   = 0.8;
    audioRef.current = audio;

    // Load the first track immediately (no autoplay — user must press Play)
    if (tracks[0]?.src) {
      audio.src = tracks[0].src;
      audio.load();
    }

    const onTimeUpdate     = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);
    const onLoadStart      = () => { setIsLoading(true);  setHasError(false); };
    const onCanPlay        = () => {
      setIsLoading(false);
      // If something asked us to play while we were loading, do it now
      if (pendingPlay.current) {
        pendingPlay.current = false;
        audio.play().catch(() => setIsPlaying(false));
      }
    };
    const onError = () => {
      setIsLoading(false);
      setHasError(true);
      pendingPlay.current = false;
    };
    const onEnded = () => {
      setIsPlaying(false);
      pendingPlay.current = true; // auto-advance should play next
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadstart",      onLoadStart);
    audio.addEventListener("canplay",        onCanPlay);
    audio.addEventListener("error",          onError);
    audio.addEventListener("ended",          onEnded);
    audio.addEventListener("play",           onPlay);
    audio.addEventListener("pause",          onPause);

    return () => {
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadstart",      onLoadStart);
      audio.removeEventListener("canplay",        onCanPlay);
      audio.removeEventListener("error",          onError);
      audio.removeEventListener("ended",          onEnded);
      audio.removeEventListener("play",           onPlay);
      audio.removeEventListener("pause",          onPause);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // ── When the track index changes, swap the src ──────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const shouldPlay = !audio.paused || pendingPlay.current;
    pendingPlay.current = false;

    audio.src = currentTrack.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (shouldPlay) {
      // canplay handler will fire it; set the flag
      pendingPlay.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  // ── Actions ─────────────────────────────────────────────────
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If src isn't set yet (shouldn't happen, but guard anyway)
    if (!audio.src || audio.src === window.location.href) {
      audio.src = tracks[currentTrackIndex]?.src || "";
      audio.load();
      pendingPlay.current = true;
      return;
    }

    const promise = audio.play();
    if (promise !== undefined) {
      promise.catch((err) => {
        console.warn("Audio play failed:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  const pause = useCallback(() => {
    pendingPlay.current = false;
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    pendingPlay.current = !audioRef.current?.paused;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  }, []);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    pendingPlay.current = !audio?.paused;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, []);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(0, time), audio.duration || 0);
  }, []);

  const setVolume = useCallback((v) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  /**
   * selectTrack — always starts playback after selection.
   * FIX: old code had `if (!wasPlaying)` which was backwards.
   */
  const selectTrack = useCallback((id) => {
    const idx = tracks.findIndex((t) => t.id === id);
    if (idx === -1) return;

    if (idx === currentTrackIndex) {
      // Same track — just toggle play/pause
      togglePlay();
      return;
    }

    // Always play when user explicitly picks a track
    pendingPlay.current = true;
    setCurrentTrackIndex(idx);
  }, [currentTrackIndex, togglePlay]);

  return {
    isPlaying,
    currentTrack,
    currentTrackIndex,
    currentTime,
    duration,
    volume,
    isLoading,
    hasError,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    selectTrack,
  };
}
