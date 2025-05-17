import React, { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import './VideoContainer.css';

function VideoContainer() {
  const videoRef = useRef(null);

  useEffect(() => {
    handleVideo();
  }, []);

  async function handleVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  }

  return (
    <div className='main-div'>
      <Container id="container">
        <video
          className='video'
          ref={videoRef}
          controls
          autoPlay
          muted
        ></video>
      </Container>
    </div>
  );
}

export default VideoContainer;
