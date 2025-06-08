import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useDispatch, useSelector } from 'react-redux';
import { updateStreamplay } from '../Redux/Bandwidthslice';

function StreamPlayer() {
  const live=useSelector(state=>state.Live.LiveStatus)
  const videoRef = useRef(null);
  const hlsUrl = "http://localhost:8080/hls/stream.m3u8";
  const dispatch=useDispatch()
  function handleClose()
  {
    dispatch(updateStreamplay(false))
  }
  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      console.log("hls is  supported")
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log("hls is not supported")
      // For Safari
      video.src = hlsUrl;
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
       <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 999,
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ✕ Close
      </button>
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      style={{ width: '100%', height: '100%' }}
    ></video>
    </div>
  );
}

export default StreamPlayer;
