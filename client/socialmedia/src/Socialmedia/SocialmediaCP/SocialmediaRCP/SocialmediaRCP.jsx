import React, { useEffect, useState } from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import { _get } from '../../axios/Axios';
import { useDispatch } from 'react-redux';
import { removeNotification } from '../../../Redux/SocialCompent';
import socket from '../../Socket/Socket';

function SocialmediaRCP() {
  const[activeusers,setActiveusers]=useState([])
  const dispatch=useDispatch()
  const userId=localStorage.getItem("userId")

  //fetch the active users 
 useEffect(()=>{
  console.log(userId)
  socket.emit("fetch-active-users",userId)
  socket.on("friends-list",(friendOnline)=>{
    console.log("this is before fetchactive users")
    console.log(friendOnline)
    setActiveusers(friendOnline)
  })


   return () => {
    socket.off("friends-list");
  };
 },[userId])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await _get('/api/socialmedia/get-notifications');
        if (response?.data?.length > 0) {
          console.log("Notification data from the response:", response.data);
          response.data.forEach((notification) => {
            if (notification.type === 'live-stream' && notification.status === 'ended' && notification.seen === true) {
              console.log("Live stream notification:", notification);
              const { notificationid, fromUser, type, status, read, timestamp } = notification;
              // Handle live stream notification as needed
                dispatch(removeNotification(notificationid));
               console.log("Deleted ended and seen notification:", notificationid);
                        
            }
          });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // const activeFriends = [
  //   { name: "Alice", image: "/images/alice.jpg" },
  //   { name: "Bob", image: "/images/bob.jpg" },
  //   { name: "Charlie", image: "/images/charlie.jpg" }
  // ];

  return (
    <div style={{ width: '250px', padding: '10px' }}>


      {/* Active Friends */}
      <h5 className="mb-3 text-primary">Active Friends</h5>
      <ListGroup variant="flush">
        {activeusers.map((friend, index) => (
          <ListGroup.Item key={index} className="d-flex align-items-center">
            <div style={{ position: 'relative', marginRight: '10px' }}>
              <Image
                src={`http://localhost:3001/uploads/profilePics/${friend.Image}`}
                roundedCircle
                style={{ width: '35px', height: '35px', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'green',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}
              ></span>
            </div>
            {friend.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default SocialmediaRCP;
