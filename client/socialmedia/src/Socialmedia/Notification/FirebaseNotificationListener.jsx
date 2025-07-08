// src/components/FirebaseNotificationListener.js
import { useEffect } from 'react';
import { onMessage, getMessaging } from 'firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotificationdata, updateShowNotification } from '../../Redux/SocialCompent';

const FirebaseNotificationListener = () => {
  const dispatch = useDispatch();

  // ⛳ You can use Redux, localStorage, or context to check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) return; // ⛔ Don't register onMessage before login

    const messaging = getMessaging();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[Foreground] Notification received:', payload);
      const data = payload.data;

      if (data?.type === 'live-stream') {
        dispatch(updateNotificationdata({
          id: data.notificationid,
          type: data.type,
          fromUser: { id: data.userId },
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
    });

    return () => {
      // no true unsubscribe for onMessage, but cleanup placeholder
    };
  }, [isLoggedIn]); // 🔁 Re-run if login state changes

  return null;
};

export default FirebaseNotificationListener;
