// UserSocketInitializer.js
import { useEffect, useRef, useState } from "react";
import socket from "./Socket";


const UserSocketInitializer = () => {
  const hasEmitted = useRef(false);

  let userId=localStorage.getItem("userId")

  useEffect(() => {
    console.log("userid from the userinitializer is ====="+userId)
    if (!userId || hasEmitted.current) return;

    hasEmitted.current = true;
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("new-user-add", userId);
    console.log("✅ new-user-add emitted globally:", userId);
  }, [userId]);

  return null;
};

export default UserSocketInitializer;
