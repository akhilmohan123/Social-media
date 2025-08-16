import React, { useEffect, useRef, useState } from 'react';
import Socialheader from './Socialheader';
import Socialmiddle from './Socialmiddle';
import socket from './Socket/Socket';
import 'react-notifications/lib/notifications.css';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateLivename, updateLiveStatus } from '../Redux/Bandwidthslice';
import { removeNotification, updateNotificationdata,updateShowNotification } from '../Redux/SocialCompent';
import { generatetoken } from '../firebase/firebase';
import { getMessaging,getToken } from "firebase/messaging";
import { onMessage } from 'firebase/messaging';
import DatabaseNotification from './Notification/DatabaseNotification';
function Social() {

  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isLive,setisLive]=useState(false);
  const dispatch=useDispatch()
  const liveUsers = useSelector(state => state.Live.liveData);
  const userID=useSelector(state=>state.User.userId)
  const socialRef=useRef(false)
  const notificationData=useSelector(state=>state.Social.notificationData)

  useEffect(()=>{
    //console.log(notificationData)
  },[notificationData])

 useEffect(() => {
  const handleGroupJoinRequest = ({ notificationid, groupId, user,username,groupname }) => {
    //console.log(notificationid, groupId, user);
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
  socket.on("notification-update", ({id}) => {
    //console.log("Notification update received"+id);
    dispatch(removeNotification(id))
    dispatch(updateShowNotification(false))
  });
  // Cleanup to avoid multiple listeners
  return () => {
    socket.off("group-joining-request", handleGroupJoinRequest);
  };
}, []); // ✅ No dependency here
useEffect(() => {
    // ✅ Register the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          //console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    const messaging = getMessaging();

    // ✅ Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      alert('Received foreground notification!');
      //console.log('[Foreground] Notification received:', payload);

      // ✅ Use `payload.data` directly (not `payload.notification.data`)
      const data = payload.data;

      if (data?.type === 'live-stream') {
        alert("Live stream notification received");

        dispatch(updateNotificationdata({
          id: data.notificationid,
          type: data.type,
          fromUser: {
            id: data.userId,
          },
          status: 'pending',
          read: false,
          timestamp: new Date().toISOString(),
        }));

        dispatch(updateShowNotification(true));
      } else if (data?.type === 'group-joining-request') {
        dispatch(updateNotificationdata({
          id: data.notificationid,
          type: data.type,
          fromUser: {
            id: data.userId,
            name: data.username,
            groupId: data.groupId,
            groupname: data.groupname,
            username: data.username,
          },
          status: 'pending',
          read: false,
          timestamp: new Date().toISOString(),
        }));

        dispatch(updateShowNotification(true));
      }

      generatetoken(); // Refresh token or re-check token if needed
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe(); // Prevent memory leak
    };
  }, [dispatch]);

  useEffect(() => {
    //console.log("Checking URL for token...");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id = params.get("id");
   
    if (token && id) {
      alert("Token found: " + token);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      setUserId(id); // update the state
      //console.log("Token stored:", token);

      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      //console.log("No token in URL");
    }
  }, []);
  useEffect(()=>{
    //console.log("user id from redux is "+userID)
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
// useEffect(() => { //if the browser refreshes socket got reconnected--------
//   const wasDisconnected = sessionStorage.getItem("was_disconnected");
//   if (wasDisconnected === "true") {
//     //console.log("Socket was disconnected due to browser refresh.");

//     sessionStorage.removeItem("was_disconnected");
//     socket.connect();
//     socket.emit("new-user-add", userId)
//   }
// }, []);


  useEffect(() => {
  // if (!userId || socialRef.current) return;

  // socialRef.current = true;

  // if (!socket.connected) {
  //   socket.connect();
  // }

  // socket.emit("new-user-add", userId);
  // console.log("user id is "+userId)
  // console.log("🔌 User added:", userId);

  const handleGroupJoinRequest = ({ notificationid, groupId, user, username, groupname }) => {
    dispatch(updateNotificationdata({
      id: notificationid,
      type: 'group-joining-request',
      fromUser: { id: user, name: username, groupId, groupname },
      status: 'pending',
      read: false,
      timestamp: new Date().toISOString(),
    }));
    dispatch(updateShowNotification(true));
  };

  const handleNotificationUpdate = ({ id }) => {
    dispatch(removeNotification(id));
    dispatch(updateShowNotification(false));
  };

  const handleLiveStreamFriend = ({ notification_id, id, name }) => {
    toast.success(`${name} Started Live`);
    dispatch(updateLivename({ id, name }));
    dispatch(updateNotificationdata({
      id: notification_id,
      type: 'live-stream',
      fromUser: { id, name },
      status: 'pending',
      read: false,
      timestamp: new Date().toISOString(),
    }));
    dispatch(updateLiveStatus(true));
  };

  function handlePost({notificationid,postid,likedusername,type}){
    console.log("Liked post notification data:",{notificationid,postid,likedusername,type})
    dispatch(updateNotificationdata({
      id:notificationid,
      type:type,
      fromUser:{name:likedusername},
      status:'pending',
      read:false,
      timestamp:new Date().toISOString()
    }))
    


  }

  // Add all listeners
  socket.on("group-joining-request", handleGroupJoinRequest);
  socket.on("notification-update", handleNotificationUpdate);
  socket.on("live-stream-friend", handleLiveStreamFriend);
  socket.on("post-liked", handlePost);
  socket.on("post-commented",handlePost)

  // Reconnect events (optional)
  // socket.on("disconnect", (reason) => {
  //   console.warn("❌ Socket disconnected:", reason);
  // });

  // socket.on("reconnect", (attempt) => {
  //   console.log("✅ Reconnected after", attempt, "attempts");
  //   socket.emit("new-user-add", userId); // re-emit on reconnect
  // });

  // ✅ Cleanup on unmount
  return () => {
    socket.off("group-joining-request", handleGroupJoinRequest);
    socket.off("notification-update", handleNotificationUpdate);
    socket.off("live-stream-friend", handleLiveStreamFriend);
    // socket.off("disconnect");
    // socket.off("reconnect");
    // socket.disconnect(); // Optional: only if you want to fully disconnect on leaving
    socialRef.current = false;
  };
}, [userId, dispatch]);

 // Re-run only when userId is available

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}>
      <Socialheader />
      <Socialmiddle />
      <DatabaseNotification/>
    </div>
  );
}

export default Social;
