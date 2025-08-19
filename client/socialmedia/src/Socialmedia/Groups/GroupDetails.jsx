import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { _get, _post, apiClient } from '../axios/Axios';
import { toast } from 'react-toastify';
import socket from '../Socket/Socket'
import { useDispatch, useSelector } from 'react-redux';

function GroupDetails({ group, onBack }) {
  const [joined, setJoined] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error,setError]=useState(null);
  const [status,Setstatus]=useState(false)
  const [reject,setReject]=useState(false);
  const user=localStorage.getItem("userId")
  const notificationdata=useSelector(state=>state.Social.notificationData)
  
  
  useEffect(()=>{
    if(error)
    {
      toast.error(error);
    }
  },[error])
  useEffect(()=>{
    
  if(group.joinRequests.includes(user))
  {
    setRequested(true)
  }
  },[group]);





 //in refresh cases whn the socket connection is lost
 useEffect(()=>{
  async function fetchStatus(){
    let response=await _get('/api/socialmedia/groups/get-group-status',{params:{groupId:group._id,user:user}})
    console.log(response)
    if(response.status==200)
    {
      if(response.data.isMember)
      {
        setJoined(true);
        setReject(false)
        Setstatus(false)
        setRequested(false)
      }else{
        setJoined(false);
        setReject(true)
        Setstatus(false)
        setRequested(false)
      }
    }
  }
  socket.on("Group-Join-Accepted",()=>{
    Setstatus(true)
    setRequested(false)
  })
  socket.on("Group-join-Rejected",()=>{
   setReject(true)
   Setstatus(false)
   setRequested(false)
  })
  fetchStatus();
 },[group,user,notificationdata]);

 async function handleJoin() {
    console.log("called the join")
    // Simulate API call
    await _post('/api/socialmedia/groups/join',{groupId:group._id}).then((response)=>{
      if(response.status==200)
      {
        Setstatus(true);
        console.log(response)
      }else{
        console.log("failed to join the group")
        setError("Failed to join the group. Please try again.");      
      }
    })
    
    console.log(`Joined ${group.groupname}`);
  }

  const handleRequest = async() => {
    setRequested(true);
    //api call for requesting to join the group
    await _post('/api/socialmedia/groups/request-join',{groupId:group._id}).then((response)=>{
      if(response.status==200)
      {
        console.log(response.data)
        console.log("request sent successfully")
        setRequested(true)
        //emits socket event for group join request
        socket.emit("group-join-request",{
          groupId:group._id,
          admin:group.admin,
          user:user
        })
        
        
      }
    }).catch((error)=>{
      console.log(error)
       setError("Failed to join the group.Please try again later")
    })
    console.log(`Requested to join ${group.groupname}`);
  };

  return (
    <div
      className="p-4"
      style={{
        minHeight: '100vh',
        borderRadius: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        backgroundColor: '#fff'
      }}
    >
      {/* Header */}
<div className="row align-items-center mb-4">
  <div className="col-auto">
    <Button variant="outline-danger" onClick={onBack} size="sm">
      ← Back
    </Button>
  </div>
  <div className="col text-center">
    <h4 className="text-secondary mb-0">
      <span className="text-dark">{group.groupname}</span>
    </h4>
  </div>
</div>


      {/* Description */}
      <p className="text-muted">{group.description || 'No description provided.'}</p>

      {/* Conditional Buttons */}
      {!joined && !requested && (
        (group.groupType === 'public' && reject) ? (
          <Button variant="success" onClick={handleJoin}>
            ✅ Join Group
          </Button>
        ) : (
          <Button variant="primary" onClick={handleRequest}>
            📩 Request to Join
          </Button>
        )
      )}

      {/* Result Message */}
      {joined && <p className="text-success mt-3">You have joined this group.</p>}
      {requested && !status  &&<p className="text-info mt-3">Join request sent successfully.</p>}
      {status && <p className='text-info mt-3'>Group Request Accepted</p>}
      
    </div>
  );
}

export default GroupDetails;
