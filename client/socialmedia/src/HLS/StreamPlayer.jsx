import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function StreamPlayer() {
  const videoRef = useRef(null);
  const hlsUrl = "http://localhost:8080/hls/stream.m3u8";

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      video.src = hlsUrl;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      style={{ width: '100%', height: '100%' }}
    ></video>
  );
}

export default StreamPlayer;
