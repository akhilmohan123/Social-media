import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import './VideoContainer.css';
import socket from '../../Socket/Socket';
import { ToastContainer, toast } from 'react-toastify';
import StreamPlayer from '../../../HLS/StreamPlayer';

function VideoContainer() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const[error,setError]=useState(false);
  const id=localStorage.getItem("userId")

  useEffect(()=>{
    console.log("user id is -------"+id)
  },[id])


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
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8', // more compatible than vp9
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            socket.emit('live-stream', {
              userId: id,
              data: reader.result, // ArrayBuffer
            });
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      mediaRecorder.start(1000); // send 1 second chunks

      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => console.error('Play error:', e));
    }
  } catch (err) {
    console.error('Error accessing media devices:', err);
    setError(true);
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
      <StreamPlayer/>
    </div>
  );
}

export default VideoContainer;