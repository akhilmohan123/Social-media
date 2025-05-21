import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import './VideoContainer.css';
import socket from '../../Socket/Socket';
import { ToastContainer, toast } from 'react-toastify';

function VideoContainer() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const[error,setError]=useState(false);
  const user=localStorage.getItem("user")

  useEffect(()=>{
    console.log("user is ======="+user)
    console.log("user id is -------"+user.id)
  },[user])


  useEffect(()=>{
    if(error){
      toast.error("Something wen wrong please try again")
    }
  },[error])
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  async function handleVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm; codecs=vp9' // vp9 has better browser support
        });
        mediaRecorderRef.current = mediaRecorder;

        // Set up data handler
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            socket.emit("video-stream", {userId:user.id,data:event.data});
          }
        };

        // Start recording with 1-second chunks
        mediaRecorder.start(1000);

        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Play error:", e));
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError(true)
    }
  }

  useEffect(() => {
    handleVideo();
    
    return () => {
      // Clean up media streams
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className='main-div'>
      <Container id="container">
        <video
          className='video'
          ref={videoRef}
          controls
          autoPlay
          muted
          playsInline // Important for mobile browsers
        />
      </Container>
    </div>
  );
}

export default VideoContainer;