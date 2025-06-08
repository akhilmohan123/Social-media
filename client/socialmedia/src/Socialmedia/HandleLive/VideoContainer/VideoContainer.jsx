import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import './VideoContainer.css';
import socket from '../../Socket/Socket';
import { ToastContainer, toast } from 'react-toastify';
import StreamPlayer from '../../../HLS/StreamPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { updateLivevideocontainer } from '../../../Redux/Bandwidthslice';

function VideoContainer() {
  const streamRef=useRef(null)
  const stoppedRef=useRef(null)
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const[error,setError]=useState(false);
  const id=localStorage.getItem("userId")
  const live=useSelector(state=>state.Live.liveVideo)
  const dispatch=useDispatch()
  // const userID=useSelector(state=>state.User.userId)
  // useEffect(()=>{
  //   console.log("user id is -------"+userID)
  // },[id])


  useEffect(()=>{
    if(error){
      toast.error("Something wen wrong please try again")
    }
  },[error])
  useEffect(() => {

    // socket.connect();
    return () => {
      // socket.disconnect();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        console.log("inside the media recorder")
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  function closecamera()
  {
  if (videoRef.current && videoRef.current.srcObject) {
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
    console.log("inside the video ref ")
  }
    if (streamRef.current) {
  streamRef.current.getTracks().forEach(track => track.stop());
  streamRef.current = null;
  console.log("inside the stream ref")
}

  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
    mediaRecorderRef.current.stop();
  }
  mediaRecorderRef.current = null;
  }

  function handleClose() {
  console.log("handle close is called");
  stoppedRef.current = true; // mark as stopped
  dispatch(updateLivevideocontainer(false));
  closecamera()
}



  async function handleVideo() {
    if(stoppedRef.current) 
      {
        console.log("video component stopped")
        return;
      }
      
    console.log("calleds video")
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    streamRef.current = stream;

   

    if (videoRef.current && live) {
      console.log("inside live")
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8', // more compatible than vp9
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
         if (stoppedRef.current) {
               console.log("Stream stopped — skipping data chunk");
            return;
           }   
        if (event.data && event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            console.log("before calling live stream")
            socket.emit('live-stream', {
              userId:id,
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
  }, [live]);

  return (
    <div className='main-div'>
      {live && (
  <div className='main-div'>
    <Container id="container" style={{ position: 'relative' }}>
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ✕ Close
      </button>

      <video
        className='video'
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
      />
    </Container>
  </div>
)}

    </div>
  );
}

export default VideoContainer;