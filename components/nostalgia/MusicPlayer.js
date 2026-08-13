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
import { tracks } from "@/data/tracks";
import PlaylistPopup from "./PlaylistPopup";

// Inline SVG icons for Spotify / YouTube (no extra dep)
function SpotifyIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function YouTubeIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

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

export default function MusicPlayer() {
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
  const progressIntervalRef = useRef(null);

  const currentTrack = tracks[trackIndex];

  // Init YouTube player once
  useEffect(() => {
    let mounted = true;

    loadYouTubeAPI().then((YT) => {
      if (!mounted || playerRef.current) return;

      playerRef.current = new YT.Player(ytContainerRef.current, {
        height: "0",
        width: "0",
        videoId: currentTrack.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume * 100);
            setIsLoading(false);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setIsLoading(false);
              setDuration(playerRef.current.getDuration());
              startProgressTracking();
            } else if (e.data === YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopProgressTracking();
            } else if (e.data === YT.PlayerState.BUFFERING) {
              setIsLoading(true);
            } else if (e.data === YT.PlayerState.ENDED) {
              setTrackIndex((i) => (i + 1) % tracks.length);
            }
          },
        },
      });
    });

    return () => {
      mounted = false;
      stopProgressTracking();
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load new video when track changes
  useEffect(() => {
    if (!playerRef.current?.loadVideoById) return;
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) {
      // Keep playing: load and auto-play the new track
      setIsLoading(true);
      playerRef.current.loadVideoById(currentTrack.youtubeId);
    } else {
      // Paused: cue without auto-playing
      playerRef.current.cueVideoById(currentTrack.youtubeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  function startProgressTracking() {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  }

  function stopProgressTracking() {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }

  const onTogglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const onNext = useCallback(() => {
    setTrackIndex((i) => (i + 1) % tracks.length);
  }, []);

  const onPrev = useCallback(() => {
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, []);

  const onSeek = useCallback((time) => {
    playerRef.current?.seekTo(time, true);
    setCurrentTime(time);
  }, []);

  const onVolumeChange = useCallback((v) => {
    setVolume(v);
    playerRef.current?.setVolume(v * 100);
  }, []);

  const onMuteToggle = useCallback(() => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
      playerRef.current?.setVolume(0);
    } else {
      const restore = prevVolume > 0 ? prevVolume : 0.8;
      setVolume(restore);
      playerRef.current?.setVolume(restore * 100);
    }
  }, [volume, prevVolume]);

  const onPlaylistToggle = useCallback(() => {
    setIsPlaylistOpen((v) => !v);
  }, []);

  const onPlaylistClose = useCallback(() => {
    setIsPlaylistOpen(false);
  }, []);

  // Select a track from the playlist by its ID
  const onSelectTrack = useCallback(
    (trackId) => {
      const idx = tracks.findIndex((t) => t.id === trackId);
      if (idx === -1) return;
      if (idx === trackIndex) {
        // Clicking the active track toggles play/pause
        onTogglePlay();
      } else {
        // Switch to new track and auto-play
        setIsPlaying(true);
        setTrackIndex(idx);
      }
    },
    [trackIndex, onTogglePlay]
  );

  const onStreamSpotify = useCallback((track) => {
    if (track?.spotifyId) {
      window.open(
        `https://open.spotify.com/track/${track.spotifyId}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }, []);

  const onStreamYoutube = useCallback((track) => {
    if (track?.youtubeId) {
      window.open(
        `https://www.youtube.com/watch?v=${track.youtubeId}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }, []);



  const handleProgressClick = useCallback(
    (e) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
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

  return (
    <>
      {/* Playlist Popup — rendered outside the player bar so it floats above */}
      <PlaylistPopup
        isOpen={isPlaylistOpen}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={onSelectTrack}
        onClose={onPlaylistClose}
        onStreamSpotify={onStreamSpotify}
        onStreamYoutube={onStreamYoutube}
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
        {/* Album Art */}
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
          {/* Track Meta */}
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
                <p className="nostalgia-player__artist">
                  {currentTrack?.artist || ""}
                  {/* {currentTrack?.language === "marathi" && (
                    <span className="nostalgia-player__lang-badge">मराठी</span>
                  )} */}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="nostalgia-player__progress-wrap">
            <span className="nostalgia-player__time">
              {formatTime(currentTime)}
            </span>
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
                <span
                  className="nostalgia-player__loading-ring"
                  aria-label="Loading"
                />
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

          {/* Streaming buttons */}
          {/* <div className="nostalgia-player__streaming">
            <motion.button
              className={`nostalgia-player__ctrl-btn nostalgia-player__stream-btn nostalgia-player__stream-btn--spotify ${embedPlatform === "spotify" ? "nostalgia-player__stream-btn--active" : ""}`}
              onClick={onSpotify}
              aria-label="Listen on Spotify"
              aria-pressed={embedPlatform === "spotify"}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.88 }}
              title="Listen on Spotify"
            >
              <SpotifyIcon size={15} />
            </motion.button>

            <motion.button
              className={`nostalgia-player__ctrl-btn nostalgia-player__stream-btn nostalgia-player__stream-btn--youtube ${embedPlatform === "youtube" ? "nostalgia-player__stream-btn--active" : ""}`}
              onClick={onYoutube}
              aria-label="Listen on YouTube"
              aria-pressed={embedPlatform === "youtube"}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.88 }}
              title="Listen on YouTube"
            >
              <YouTubeIcon size={15} />
            </motion.button>
          </div> */}

          {/* Playlist toggle */}
          <motion.button
            className={`nostalgia-player__ctrl-btn nostalgia-player__playlist-btn ${isPlaylistOpen ? "nostalgia-player__playlist-btn--active" : ""}`}
            onClick={onPlaylistToggle}
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
    </>
  );
}