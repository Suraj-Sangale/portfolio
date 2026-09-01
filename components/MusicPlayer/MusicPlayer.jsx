'use client';
import { useEffect, useRef, useState } from 'react';
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI';
import styles from '@/styles/musicPlayer.module.scss';

export default function MusicPlayer({ tracks }) {
  
  const YT = useYouTubeAPI();
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);

  const currentTrack = tracks[trackIndex];

  // Initialize player once YT API is loaded
  useEffect(() => {
    if (!YT || playerRef.current) return;

    playerRef.current = new YT.Player(containerRef.current, {
      height: '0',
      width: '0',
      videoId: currentTrack.youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
      },
      events: {
        onReady: (e) => {
          e.target.setVolume(volume);
          setIsReady(true);
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            setDuration(playerRef.current.getDuration());
            startProgressTracking();
          } else if (e.data === YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            stopProgressTracking();
          } else if (e.data === YT.PlayerState.ENDED) {
            handleNext();
          }
        },
      },
    });

    return () => {
      stopProgressTracking();
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [YT]);

  // Load a new video when track changes
  useEffect(() => {
    if (isReady && playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(currentTrack.youtubeId);
      setCurrentTime(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex, isReady]);

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

  function togglePlay() {
    if (!isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  function handleNext() {
    setTrackIndex((i) => (i + 1) % tracks.length);
  }

  function handlePrev() {
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }

  function handleSeek(e) {
    const value = Number(e.target.value);
    playerRef.current?.seekTo(value, true);
    setCurrentTime(value);
  }

  function handleVolumeChange(e) {
    const value = Number(e.target.value);
    setVolume(value);
    playerRef.current?.setVolume(value);
  }

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className={styles.player}>
      {/* Hidden actual YouTube iframe target */}
      <div ref={containerRef} style={{ display: 'none' }} />

      <div className={styles.trackInfo}>
        <img src={currentTrack.cover} alt={currentTrack.title} className={styles.cover} />
        <div>
          <p className={styles.title}>{currentTrack.title}</p>
          <p className={styles.artist}>{currentTrack.artist}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button onClick={handlePrev} aria-label="Previous">⏮</button>
        <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={handleNext} aria-label="Next">⏭</button>
      </div>

      <div className={styles.progress}>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className={styles.volume}>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}