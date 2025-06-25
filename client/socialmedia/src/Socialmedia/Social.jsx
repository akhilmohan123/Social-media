import React, { useEffect, useRef, useState } from 'react';
import Socialheader from './Socialheader';
import Socialmiddle from './Socialmiddle';
import socket from './Socket/Socket';
import 'react-notifications/lib/notifications.css';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateLivename, updateLiveStatus } from '../Redux/Bandwidthslice';
import { updateNotificationdata,updateShowNotification } from '../Redux/SocialCompent';

function Social() {
  
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isLive,setisLive]=useState(false);
  const dispatch=useDispatch()
  const liveUsers = useSelector(state => state.Live.liveData);
  const userID=useSelector(state=>state.User.userId)
  const socialRef=useRef(false)
  const notificationData=useSelector(state=>state.Social.notificationData)

  useEffect(()=>{
    console.log(notificationData)
  },[notificationData])

 useEffect(() => {
  const handleGroupJoinRequest = ({ notificationid, groupId, user,username,groupname }) => {
    console.log(notificationid, groupId, user);
    dispatch(updateNotificationdata({
      id: notificationid,
      type: 'group-joining-request',
      fromUser: {
        id: user,
        name:username,
        groupId,
        groupname
      },
      status: 'pending',
      read: false,
      timestamp: new Date().toISOString(),
    }));
      dispatch(updateShowNotification(true))
  };

  socket.on("group-joining-request", handleGroupJoinRequest);

  // Cleanup to avoid multiple listeners
  return () => {
    socket.off("group-joining-request", handleGroupJoinRequest);
  };
}, []); // ✅ No dependency here

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
    console.log("user id from redux is "+userID)
  },[userID])
  useEffect(()=>{
    if(isLive)
    {
     liveUsers.map((user)=>{
      toast.info(`${user.name} started Live`)
     })
    }

  },[liveUsers])
  useEffect(() => {
  const handleBeforeUnload = () => {
    sessionStorage.setItem("was_disconnected", "true");
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, []);
useEffect(() => { //if the browser refreshes socket got reconnected--------
  const wasDisconnected = sessionStorage.getItem("was_disconnected");
  if (wasDisconnected === "true") {
    console.log("Socket was disconnected due to browser refresh.");

    sessionStorage.removeItem("was_disconnected");
    socket.connect();
    socket.emit("new-user-add", userId)
  }
}, []);


  useEffect(() => {
    console.log("Called")
    
  // if (!userId || !socket || !socialRef.current) return;
  //  socialRef.current=true
  // const handleConnect = () => {
  //   socket.emit("new-user-add", userId);
  //   console.log("Sent new-user-add for:", userId);
  // };
  // socket.connect()
  // socket.on("connect", handleConnect);
  if(!socialRef.current && userId)
  {
    socialRef.current=true
    socket.emit("new-user-add", userId);
  }
  socket.on("live-stream-friend", (data) => {
    const{notification_id,id,name}=data
    console.log("id is "+id)
    console.log("name is =="+name)
    toast.success(`${name} Started Live`)
    dispatch(updateLivename({id:id,name:name}))
    //dispatch the notificationdata//
    dispatch(updateNotificationdata({
      id:notification_id,
      type:'live-stream-friend',
      fromUser:{id:id,name:name},
      status:'pending',
      read:false,
      timestamp:new Date().toISOString()
    }))
    alert("live started")
    dispatch(updateLiveStatus(true))
    console.log("yeah live started");
  });
  socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
  // Optionally: show "Reconnecting..." UI
});

socket.on("reconnect", (attempt) => {
  console.log("Reconnected after", attempt, "attempts");
  // Optionally: re-authenticate or re-subscribe
});
  // return () => {
  //   socket.off("connect", handleConnect);
  //   socket.off("live-stream-friend");
  // };
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
