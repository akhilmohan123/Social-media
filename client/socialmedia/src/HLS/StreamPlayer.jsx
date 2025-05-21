import React from 'react'
import { useEffect,useRef } from 'react'
import Hls from 'hls.js'


function StreamPlayer() {
    const videoRef=useRef(null);
    useEffect(()=>{
        const video=videoRef.current;
        if(Hls.isSupported()){
            const hls=new Hls();
            hls.loadSource("http://localhost:8080/hls/stream.m3u8")
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,()=>{
                video.play();
            })
        }else{
            video.src="http://localhost:8080/hls.stream.m3u8"
            video.addEventListene("loademetadata",()=>{
                video.play();
            })
        }
    })
  return (
    <video ref={videoRef} controls autoPlay muted  style={{width:"100%",height:"100%"}}></video>
  )
}

export default StreamPlayer
