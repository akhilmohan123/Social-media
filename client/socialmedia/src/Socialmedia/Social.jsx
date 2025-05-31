import React, { useEffect, useState } from 'react';
import Socialheader from './Socialheader';
import Socialmiddle from './Socialmiddle';
import socket from './Socket/Socket';

function Social() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isLive,setisLive]=useState(false);
  useEffect(() => {
    console.log("Checking URL for token...");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id = params.get("id");

    if (token && id) {
      alert("Token found: " + token);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      setUserId(id); // update the state
      console.log("Token stored:", token);

      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("No token in URL");
    }
  }, []);

  useEffect(() => {
    if (!userId || !socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("new-user-add", userId);
    console.log("Sent new-user-add for:", userId);

    socket.on("live-stream-friend", () => {
      setisLive(true)
      console.log("yeah live started");
    });

    return () => {
      socket.off("live-stream-friend");
    };
  }, [userId]); // Re-run only when userId is available

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}>
      <Socialheader />
      <Socialmiddle live={isLive} />
    </div>
  );
}

export default Social;
