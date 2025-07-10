import React, { useEffect, useRef } from 'react';
import { _get, apiClient } from '../axios/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotificationdata, updateShowNotification } from '../../Redux/SocialCompent';

function DatabaseNotification() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  // 👇 get existing notifications from redux
  const existingNotification = useSelector((state) => state.Social.notificationData);

  useEffect(() => {
 if (token && !hasFetched.current) {
      hasFetched.current = true;
      getNotificationFromDatabase();
    }
  }, [token]);

  async function getNotificationFromDatabase() {
    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await _get('/api/socialmedia/get-notifications');

      if (response?.data?.length > 0) {
        console.log("Notification data from the response:", response.data);
        console.log(existingNotification)
        response.data.forEach((notification) => {
          const { notificationid, fromUser, type, status, read, timestamp } = notification;
           const exists = existingNotification.some(n => n.notificationid === notificationid);
            console.log("Existing notifications:", existingNotification);   
          // 👇 check if the same notificationid already exists
          if (exists) {
            console.log("Duplicate notification, skipping:", notificationid);
            return;
          }

          console.log("Notification ID:", notificationid);

          if (type === "live-stream" || type === "group-joining-request") {
            dispatch(updateNotificationdata({
              notificationid,
              fromUser,
              type,
              status,
              read,
              timestamp
            }));
            dispatch(updateShowNotification(true));
            hasFetched.current = false;
            console.log("Notification added to Redux:", notificationid);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching notifications from the database:", error);
    }
  }

  return null;
}

export default DatabaseNotification;
