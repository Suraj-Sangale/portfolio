'use client';
import { useEffect, useState } from 'react';

let apiPromise = null;

function loadYouTubeAPI() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });

  return apiPromise;
}

export function useYouTubeAPI() {
  const [YT, setYT] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadYouTubeAPI().then((yt) => {
      if (mounted) setYT(yt);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return YT;
}