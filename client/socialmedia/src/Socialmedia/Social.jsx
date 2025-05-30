import React, { useEffect } from 'react'
import Socialheader from './Socialheader'
import Socialmiddle from './Socialmiddle'
import socket from './Socket/Socket'

socket.on("live-stream-friend", () => {
        const userId = localStorage.getItem("userId");

    if (!userId) {
      console.warn("No userId found in localStorage");
      return;
    }

    // Connect and emit new-user-add
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("new-user-add", userId);
    console.log("User added to socket:", userId);

    socket.on("live-stream-friend", () => {
      console.log("yeah live started");
    });

    return () => {
      socket.off("live-stream-friend");
    };
  });
function Social() {

  useEffect(()=>{
    if (!socket) return;

  // Make sure socket is connected
  if (!socket.connected) {
    socket.connect();
  }

  socket.on("live-stream-friend", () => {
    console.log("yeah live started");
  });

  return () => {
    socket.off("live-stream-friend");
  };
  },[])
  useEffect(() => {
    console.log("Checking URL for token...");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id=params.get("id")
    console.log("user id is "+id)
    if (token) {
      alert("Token found: " + token);
      localStorage.setItem("token", token);
      localStorage.setItem("userId",id)
      console.log("Token stored:", token);

      // Remove ?token=... from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("No token in URL");
    }
  }, []);
  return (
    <div style={{backgroundColor:'white',height: '100vh', width: '100vw'}}>
       <Socialheader/>
       <Socialmiddle/>
       
    </div>
  )
}

export default Social
