// NotificationBell.js
import React, { useEffect, useState } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { BellFill } from "react-bootstrap-icons"; // Optional, use Bootstrap Icons
import { useDispatch, useSelector } from "react-redux";
import { updateStreamplay } from "../../Redux/Bandwidthslice";
import socket from "../Socket/Socket";
import "./Notificationbell.css";
import {
  markNotificationAsRead,
  updateNotificationdata,
  updateShowNotification,
  removeNotification,
} from "../../Redux/SocialCompent";
import { _post, apiClient } from "../axios/Axios";

const Notificationbell = () => {
  const live = useSelector((state) => state.Live.LiveStatus);
  const livedata = useSelector((state) => state.Live.liveData);
  const notification = useSelector((state) => state.Social.showNotification);
  const notificationdata = useSelector(
    (state) => state.Social.notificationData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (live) {
      dispatch(updateShowNotification(true));
      notificationdata.forEach((notif) => {
        console.log("notification data:", notif);
        //you can
      });
    }
  }, [live, dispatch]);

  useEffect(() => {
    if (notificationdata.length > 0) {
      dispatch(updateShowNotification(true)); // Trigger the notification flag
    } else {
      dispatch(updateShowNotification(false)); // Reset if no notifications
    }
  }, [notificationdata, dispatch]);
  useEffect(() => {
    console.log(notificationdata);
    console.log("Notification data updated:", notification);
  }, [notificationdata]);

  async function handleLiveClick() {
    dispatch(updateStreamplay(true));
    dispatch(markNotificationAsRead(notificationdata));
    await _post(
      "/api/socialmedia/mark-notification-as-read",
      {id:notificationdata.id}
    ).then((response) => {
      if (response) {
        // Remove the live notification from the local notification list (Redux)
        dispatch(updateNotificationdata(notificationdata.id));
        dispatch(removeNotification(notificationdata.id));
        // Emit a socket event to notify other clients about the live stream
      }
    });
  }
  async function handleAccept(notification) {
    try {
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;

      // Call backend to accept the group join request
      await _post("/api/socialmedia/groups/join-accept", notification).then(
        (response) => {
          if (response) {
            console.log(response);
            // Mark the notification as read in Redux
            dispatch(markNotificationAsRead(notification));

            // Remove the accepted notification from the local notification list (Redux)
            dispatch(updateNotificationdata(notification.id));
            dispatch(removeNotification(notification.id));
            dispatch(updateShowNotification(false));
            // Emit the socket event to notify other clients about the acceptance
            socket.emit("group-request-accepted", {
              id: notification.id,
              userid: notification.fromUser.id,
            });

            alert("Group join request accepted!");
          }
        }
      );
    } catch (error) {
      console.log("Error accepting group join:", error);
    }
  }

  async function handledPostClick(notification) {
    try {

      // Call backend to mark the post as liked
      await _post("/api/socialmedia/mark-notification-as-read", {id:notification.id}).then(
        (response) => {
          if (response) {
            console.log("Notification status is updated :", response);
            // Mark the notification as read in Redux
            dispatch(markNotificationAsRead(notification));

            // Remove the liked notification from the local notification list (Redux)
            dispatch(updateNotificationdata(notification.id));
            dispatch(removeNotification(notification.id));
            dispatch(updateShowNotification(false));

            // Emit the socket event to notify other clients about the like
          }
        }
      );
    } catch (error) {
      console.log("Error liking post:", error);
    }
  }

  async function handleReject(notification) {
    try {
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;

      // Call backend to reject the group join request
      await _post("/api/socialmedia/groups/join-reject", notification).then(
        (response) => {
          if (response) {
            // Remove the rejected notification from the local notification list (Redux)
            dispatch(updateNotificationdata(notification.id));
            dispatch(removeNotification(notification.id));
            dispatch(updateShowNotification(false));
            // Emit a socket event for rejection if needed
            // socket.emit('reject-group-request-join', notification);
            alert("Group join request rejected.");

            socket.emit("group-request-rejected", {
              id: notification.id,
              userid: notification.fromUser.id,
            });
          }
        }
      );
    } catch (error) {
      console.log("Error rejecting group join:", error);
    }
  }

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="light"
        id="dropdown-basic"
        className="position-relative"
      >
        <BellFill size={20} />
        {notification && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            .
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: "300px" }}>
        <Dropdown.Header>Notifications</Dropdown.Header>

        {notification ? (
          <>
            {/* Render stream notifications */}
            {notificationdata
              .filter((notif) => {
                console.log("Filtering notification:", notif); // Debugging log
                return notif?.type === "live-stream" && notif?.fromUser;
              })
              .map((notif) => (
                <Dropdown.Item key={notif.id} onClick={handleLiveClick}>
                  <div className="d-flex justify-content-between">
                    <strong>{notif.fromUser.name}</strong>
                    <small className="text-muted">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                    started a live stream
                  </div>
                </Dropdown.Item>
              ))}

            {/* Render group join notifications */}
            {notificationdata
              .filter(
                (notif) =>
                  notif?.type === "group-joining-request" && notif?.fromUser
              )
              .map((notif) => (
                <Dropdown.Item
                  key={notif.id}
                  className="notification-item border-bottom"
                  style={{ padding: "10px" }}
                >
                  <div className="d-flex justify-content-between">
                    <strong>{notif.fromUser?.name || "Someone"}</strong>
                    <small className="text-muted">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                  <div
                    className="text-muted mb-2"
                    style={{ fontSize: "0.875rem" }}
                  >
                    requested to join your{" "}
                    {notif.fromUser?.groupname || "group"}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAccept(notif)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleReject(notif)}
                    >
                      Reject
                    </button>
                  </div>
                </Dropdown.Item>
              ))}
            {/* Render the liked post notification */}
            {notificationdata.map((notif) => {
              if (notif.type === "liked-post") {
                return (
                  <Dropdown.Item
                    key={notif.id}
                    className="notification-item border-bottom"
                    style={{ padding: "10px" }}
                    onClick={() => handledPostClick(notif)}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{notif.fromUser?.name || "Someone"}</strong>
                      <small className="text-muted">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                    <div
                      className="text-muted mb-2"
                      style={{ fontSize: "0.875rem" }}
                    >
                      liked your post
                    </div>
                  </Dropdown.Item>
                );
              }
              if (notif.type === "add-comment") {
                return (
                  <Dropdown.Item
                    key={notif.id}
                    className="notification-item border-bottom"
                    style={{ padding: "10px" }}
                    onClick={() => handledPostClick(notif)}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{notif.fromUser?.name || "Someone"}</strong>
                      <small className="text-muted">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                    <div
                      className="text-muted mb-2"
                      style={{ fontSize: "0.875rem" }}
                    >
                      commented on your post
                    </div>
                  </Dropdown.Item>
                );
              }
            })}
          </>
        ) : (
          <div className="text-center text-muted p-3">No new notifications</div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notificationbell;
