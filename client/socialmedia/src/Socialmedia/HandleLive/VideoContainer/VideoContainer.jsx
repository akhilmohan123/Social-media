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
  stoppedRef.current=false
    // socket.connect();
    return () => {
      // socket.disconnect();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        console.log("inside the media recorder")
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  function closecamera() {
  // 1. Set stopped flag immediately
  stoppedRef.current = true;
  
  // 2. Stop media recorder and remove handlers
  if (mediaRecorderRef.current) {
    try {
      mediaRecorderRef.current.ondataavailable = null;
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      console.error("Error stopping recorder:", e);
    }
    mediaRecorderRef.current = null;
  }

  // 3. Stop all tracks
  const stopTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
  };

  stopTracks(videoRef.current?.srcObject);
  stopTracks(streamRef.current);

  // 4. Clean video element
  if (videoRef.current) {
    videoRef.current.srcObject = null;
    videoRef.current.load();
  }

  // 5. Clear refs
  streamRef.current = null;
}

function handleClose() {
  console.log("handle close is called");
  dispatch(updateLivevideocontainer(false));
  console.log("user id is "+id)
  closecamera();
  //Notify server stream is stopped 
  socket.emit('stream-ended',{userId:id})
}



  async function handleVideo() {
  if (stoppedRef.current) {
    console.log("Video component stopped - skipping");
    return;
  }

  console.log("Starting video...");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    streamRef.current = stream;

    if (videoRef.current && live) {
      // Clear any existing recorder first
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.ondataavailable = null;
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8',
      });
      
      // Store the stopped state in closure
      let isStopped = false;
      
      mediaRecorder.ondataavailable = (event) => {
        if (stoppedRef.current || isStopped) {
          console.log("Stream stopped — skipping data chunk"+isStopped);
          return;
        }
        
        if (event.data && event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (!stoppedRef.current && !isStopped) {
              socket.emit('live-stream', {
                userId: id,
                data: reader.result,
              });
            }
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      // Update ref and add stop handler
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.onstop = () => {
        isStopped = true;
      };

      mediaRecorder.start(1000);
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  } catch (err) {
    console.error('Error accessing media devices:', err);
    setError(true);
  }
}


useEffect(() => {
  if(live) {
    handleVideo()
  } else {
    closecamera()
  }
  
  return () => {
    closecamera();
    // Notify server stream is stopped
    
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