import React, { useEffect, useRef } from 'react';
import { _get, apiClient } from '../axios/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotificationdata, updateShowNotification,removeNotification } from '../../Redux/SocialCompent';

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
          const { notificationid, fromUser, type, status, read, timestamp ,seen} = notification;
           const exists = existingNotification.some(n => n.notificationid === notificationid);
            console.log("Existing notifications:", existingNotification);   
            //if the status is ended then we dont want to show the notifiction
              if (status === 'ended' && seen === true && read === true) {
              try {
                   dispatch(removeNotification(notificationid));
                    console.log("Deleted ended and seen notification:", notificationid);
                  } catch (err) {
                    console.error("Failed to delete notification:", err);
                  } 
                  return;
              }
              //if the status is accepted or rejected and read is true then we dont want to show the notification
              if(status === 'accepted' || status === 'rejected' && read === true)
              {
                try {
                   dispatch(removeNotification(notificationid));
                   console.log("Deleted accepted/rejected and seen notification:", notificationid);
                } catch (error) {
                   console.error("Failed to delete notification:", error);
                }
              }
          // 👇 check if the same notificationid already exists
          if (exists) {
            console.log("Duplicate notification, skipping:", notificationid);
            return;
          }

          console.log("Notification ID:", notificationid);

          if (type === "live-stream") {
               const payload = {
               notificationid,
               fromUser,
               type,
               status,
               read,
               timestamp
            };

          if (type === "group-joining-request") {
          // Add additional fields specific to group joining
           payload.groupname = notification.groupname;
           payload.groupid = notification.groupid;
           payload.admin = notification.admin;
          }

          if(type=="post-liked")
          {
            payload.likedusername = notification.likedusername;
            payload.postid = notification.postid;
          }

           dispatch(updateNotificationdata(payload));
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
