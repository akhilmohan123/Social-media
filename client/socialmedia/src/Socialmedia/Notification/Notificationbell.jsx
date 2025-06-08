// NotificationBell.js
import React, { useEffect, useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons'; // Optional, use Bootstrap Icons
import { useDispatch, useSelector } from 'react-redux';
import { updateStreamplay } from '../../Redux/Bandwidthslice';
import './Notificationbell.css'
const Notificationbell = () => {


  const live=useSelector(state=>state.Live.LiveStatus)
  const livedata=useSelector(state=>state.Live.liveData)
  const dispatch=useDispatch()

  //update stream player based on clicking the notification
 function handleClick(id)
 {
  if(id)
  {
     dispatch(updateStreamplay(true))
  }
 }
  useEffect(()=>{
    console.log("called the notifiucation component")
    console.log(livedata)
  },[livedata])
  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" id="dropdown-basic" className="position-relative">
        <BellFill size={20} />
        {live && (
          <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
           .
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: '300px' }}>
        <Dropdown.Header>Notifications</Dropdown.Header>
       {live ? (
  livedata.map((notif) => (
    <Dropdown.Item
      key={notif.id}
      onClick={() => handleClick(notif.id)}
      className="notification-item border-bottom"
      style={{ cursor: 'pointer', padding: '10px' }}
    >
      <div className="d-flex justify-content-between">
        <strong>{notif.name}</strong>
        {/* Optional: Show time if available */}
        {/* <small className="text-muted">{notif.time}</small> */}
      </div>
      <div className="text-muted" style={{ fontSize: '0.875rem' }}>
        started a live stream
      </div>
    </Dropdown.Item>
  ))
) : (
  <div className="text-center text-muted p-3">No new notifications</div>
)}

      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notificationbell;
