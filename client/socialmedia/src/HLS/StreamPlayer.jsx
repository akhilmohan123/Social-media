import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useDispatch, useSelector } from 'react-redux';
import { updateStreamplay } from '../Redux/Bandwidthslice';

function StreamPlayer() {
  const live = useSelector(state => state.Live.LiveStatus);
  const videoRef = useRef(null);
  const hlsUrl = "http://localhost:8080/hls/stream.m3u8";
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  function handleClose() {
    dispatch(updateStreamplay(false));
  }

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();

      function loadStream(retries = 0) {
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("Stream is ready ✅");
          setLoading(false);
          video.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);

          if (data.fatal && data.details === "manifestLoadError") {
            console.warn(`Stream not ready yet. Retry #${retries}`);
            if (retries < 10) {
              setTimeout(() => loadStream(retries + 1), 2000); // retry after 2s
            } else {
              console.error("Stream failed after 10 retries ❌");
              setLoading(false);
            }
          }
        });
      }

      loadStream();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native support
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play();
      });
    }
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 999,
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ✕ Close
      </button>

      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 500,
          }}
        >
          ⏳ Waiting for live stream...
        </div>
      )}

      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: "100%", height: "100%" }}
      ></video>
    </div>
  );
}

export default StreamPlayer;
