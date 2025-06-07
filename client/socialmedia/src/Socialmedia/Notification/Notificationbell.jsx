// NotificationBell.js
import React, { useEffect, useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons'; // Optional, use Bootstrap Icons
import { useDispatch, useSelector } from 'react-redux';
import { updateStreamplay } from '../../Redux/Bandwidthslice';

const Notificationbell = () => {


  const live=useSelector(state=>state.Live.LiveStatus)
  const livedata=useSelector(state=>state.Live.liveData)
  const dispatch=useDispatch()
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
        {live ?(
          livedata.map((notif) => (
            <Dropdown.Item key={notif.id} className="d-flex flex-column">
              <div onClick={handleClick(notif.id)}>{notif.name} started live</div>
              {/* <small className="text-muted">{notif.time}</small> */}
            </Dropdown.Item>
          ))
        ): (
          <div className="text-center text-muted p-3">No new notifications</div>
        ) }
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notificationbell;
