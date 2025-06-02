import React, { useEffect, useState } from 'react';
import Socialheader from './Socialheader';
import Socialmiddle from './Socialmiddle';
import socket from './Socket/Socket';
import 'react-notifications/lib/notifications.css';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateLivename, updateLiveStatus } from '../Redux/Bandwidthslice';
function Social() {
  
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isLive,setisLive]=useState(false);
  const dispatch=useDispatch()
  const liveUsers = useSelector(state => state.Live.liveUsers);
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
  useEffect(()=>{
    if(isLive)
    {
     liveUsers.map((user)=>{
      toast.info(`${user.name} started Live`)
     })
    }

  },[liveUsers])

  useEffect(() => {
    console.log("Called")
  if (!userId || !socket) return;

  const handleConnect = () => {
    socket.emit("new-user-add", userId);
    console.log("Sent new-user-add for:", userId);
  };
  socket.connect()
  socket.on("connect", handleConnect);

  socket.on("live-stream-friend", (data) => {
    const{id,name}=data
    dispatch(updateLivename(id,name))
    dispatch(updateLiveStatus(true))
    console.log("yeah live started");
  });

  return () => {
    socket.off("connect", handleConnect);
    socket.off("live-stream-friend");
  };
}, [userId]);
 // Re-run only when userId is available

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}>
      <Socialheader />
      <Socialmiddle />
    </div>
  );
}

export default Social;
