"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";
import { useRef, useCallback, useEffect, useState } from "react";
import PlaylistPopup from "./PlaylistPopup";

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// --- YouTube IFrame API loader (singleton) ---
let ytApiPromise = null;
function loadYouTubeAPI() {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
  return ytApiPromise;
}

export default function MusicPlayer({ tracks = [] }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const progressRef = useRef(null);
  const ytContainerRef = useRef(null);
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  // Store latest isPlaying in a ref so interval callbacks are always fresh
  const isPlayingRef = useRef(false);

  const currentTrack = tracks[trackIndex];

  // ── Progress timer ──────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 300);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── Init YouTube player ONCE ────────────────────────────────────────
  useEffect(() => {
    if (!tracks.length) return;
    let mounted = true;

    loadYouTubeAPI().then((YT) => {
      if (!mounted || playerRef.current) return;

      playerRef.current = new YT.Player(ytContainerRef.current, {
        height: "0",
        width: "0",
        videoId: tracks[0].youtubeId,
        playerVars: {
          autoplay: 1,   // ask YT to autoplay
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            if (!mounted) return;
            e.target.setVolume(0.8 * 100);
            setIsLoading(false);
            // Attempt autoplay (browser may block this)
            e.target.playVideo();

            // Check after a short delay if autoplay actually started
            setTimeout(() => {
              if (!mounted) return;
              const state = e.target.getPlayerState?.();
              if (state === YT.PlayerState.PLAYING) {
                isPlayingRef.current = true;
                setIsPlaying(true);
                setDuration(e.target.getDuration());
                startTimer();
              } else {
                // Autoplay blocked — stay paused
                isPlayingRef.current = false;
                setIsPlaying(false);
                setIsLoading(false);
              }
            }, 1000);
          },

          onStateChange: (e) => {
            if (!mounted) return;
            const { PLAYING, PAUSED, BUFFERING, ENDED } = YT.PlayerState;

            if (e.data === PLAYING) {
              isPlayingRef.current = true;
              setIsPlaying(true);
              setIsLoading(false);
              setDuration(playerRef.current.getDuration());
              startTimer();
            } else if (e.data === PAUSED) {
              isPlayingRef.current = false;
              setIsPlaying(false);
              stopTimer();
            } else if (e.data === BUFFERING) {
              setIsLoading(true);
            } else if (e.data === ENDED) {
              stopTimer();
              setCurrentTime(0);
              setTrackIndex((i) => (i + 1) % tracks.length);
            }
          },
        },
      });
    });

    return () => {
      mounted = false;
      stopTimer();
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ── Swap video when trackIndex changes ──────────────────────────────
  useEffect(() => {
    const player = playerRef.current;
    if (!player?.loadVideoById) return;
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);

    if (isPlayingRef.current) {
      player.loadVideoById(currentTrack.youtubeId);   // auto-plays
    } else {
      player.cueVideoById(currentTrack.youtubeId);    // queued, not playing
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  // ── Controls ────────────────────────────────────────────────────────
  const onTogglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlayingRef.current) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, []);

  const onNext = useCallback(() => {
    setTrackIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const onPrev = useCallback(() => {
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const onSeek = useCallback((time) => {
    playerRef.current?.seekTo(time, true);
    setCurrentTime(time);
  }, []);

  const onVolumeChange = useCallback((v) => {
    setVolume(v);
    playerRef.current?.setVolume(v * 100);
  }, []);

  const onMuteToggle = useCallback(() => {
    setVolume((vol) => {
      if (vol > 0) {
        setPrevVolume(vol);
        playerRef.current?.setVolume(0);
        return 0;
      } else {
        const restore = prevVolume > 0 ? prevVolume : 0.8;
        playerRef.current?.setVolume(restore * 100);
        return restore;
      }
    });
  }, [prevVolume]);

  const onSelectTrack = useCallback(
    (trackId) => {
      const idx = tracks.findIndex((t) => t.id === trackId);
      if (idx === -1) return;
      if (idx === trackIndex) {
        onTogglePlay();
      } else {
        isPlayingRef.current = true; // force play on next track
        setTrackIndex(idx);
      }
    },
    [trackIndex, onTogglePlay, tracks]
  );

  const handleProgressClick = useCallback(
    (e) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  const handleProgressKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") onSeek(Math.min(duration, currentTime + 5));
      if (e.key === "ArrowLeft") onSeek(Math.max(0, currentTime - 5));
    },
    [currentTime, duration, onSeek]
  );

  const progress = duration > 0 ? currentTime / duration : 0;

  // ── Keyboard shortcuts ───────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      const target = e.target;
      const isTypingContext =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTypingContext) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault(); // stop page from scrolling on Space
          onTogglePlay();
          break;
        case "n":
          onNext();
          break;
        case "p":
          onPrev();
          break;
        case "l":
          setIsPlaylistOpen((v) => !v);
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePlay, onNext, onPrev]);


  return (
    <>
      {/* Playlist Popup */}
      <PlaylistPopup
        isOpen={isPlaylistOpen}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={onSelectTrack}
        onClose={() => setIsPlaylistOpen(false)}
        tracks={tracks}
      />

      <motion.div
        className="glass-player nostalgia-player"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        role="region"
        aria-label="Music player"
      >
        {/* Hidden YouTube player target */}
        <div ref={ytContainerRef} style={{ display: "none" }} />

        <div className="nostalgia-player__inner">
          {/* Album Art — spins when playing */}
          <div className={`nostalgia-player__art${isPlaying ? " spinning" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack?.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="nostalgia-player__art-inner"
              >
                <Image
                  src={currentTrack?.cover || "/scenes/album_default.png"}
                  alt={currentTrack?.title || "Album art"}
                  fill
                  sizes="100px"
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center: Track info + progress */}
          <div className="nostalgia-player__center">
            <div className="nostalgia-player__meta">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTrack?.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="nostalgia-player__title">
                    {currentTrack?.title || "Select a track"}
                  </p>
                  <p className="nostalgia-player__artist">{currentTrack?.artist || ""}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="nostalgia-player__progress-wrap">
              <span className="nostalgia-player__time">{formatTime(currentTime)}</span>
              <div
                className="nostalgia-player__progress"
                ref={progressRef}
                onClick={handleProgressClick}
                onKeyDown={handleProgressKeyDown}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={duration || 100}
                aria-valuenow={Math.round(currentTime)}
                tabIndex={0}
              >
                <div className="nostalgia-player__track">
                  <motion.div
                    className="nostalgia-player__fill"
                    style={{ width: `${progress * 100}%` }}
                  />
                  <motion.div
                    className="nostalgia-player__thumb"
                    style={{ left: `${progress * 100}%` }}
                  />
                </div>
              </div>
              <span className="nostalgia-player__time nostalgia-player__time--right">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="nostalgia-player__controls">
            {/* Transport */}
            <div className="nostalgia-player__transport">
              <motion.button
                className="nostalgia-player__ctrl-btn"
                onClick={onPrev}
                aria-label="Previous track"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <SkipBack size={18} />
              </motion.button>

              <motion.button
                className="nostalgia-player__play-btn"
                onClick={onTogglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                {isLoading ? (
                  <span className="nostalgia-player__loading-ring" aria-label="Loading" />
                ) : isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} style={{ marginLeft: 2 }} />
                )}
              </motion.button>

              <motion.button
                className="nostalgia-player__ctrl-btn"
                onClick={onNext}
                aria-label="Next track"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <SkipForward size={18} />
              </motion.button>
            </div>

            {/* Volume */}
            <div className="nostalgia-player__volume">
              <button
                className="nostalgia-player__ctrl-btn"
                onClick={onMuteToggle}
                aria-label={volume > 0 ? "Mute" : "Unmute"}
              >
                {volume > 0 ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="nostalgia-player__volume-slider"
                style={{ "--volume-progress": `${volume * 100}%` }}
                aria-label="Volume"
              />
            </div>

            {/* Playlist toggle */}
            <motion.button
              className={`nostalgia-player__ctrl-btn nostalgia-player__playlist-btn ${
                isPlaylistOpen ? "nostalgia-player__playlist-btn--active" : ""
              }`}
              onClick={() => setIsPlaylistOpen((v) => !v)}
              aria-label="Toggle playlist"
              aria-expanded={isPlaylistOpen}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <ListMusic size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Keyboard shortcut hints (desktop only) ── */}
      <motion.div
        className="nostalgia-player__keyhints"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-hidden="true"
      >
        {[
          { keys: ["Space", "K"], label: "Play / Pause" },
          { keys: ["N"],         label: "Next" },
          { keys: ["P"],         label: "Prev" },
          { keys: ["L"],         label: "Playlist" },
        ].map(({ keys, label }) => (
          <span key={label} className="nostalgia-player__keyhint">
            {keys.map((k) => (
              <kbd key={k} className="nostalgia-player__kbd">{k}</kbd>
            ))}
            <span className="nostalgia-player__keylabel">{label}</span>
          </span>
        ))}
      </motion.div>
    </>
  );
}
