import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { _post, apiClient } from '../axios/Axios';
import { toast } from 'react-toastify';

function GroupDetails({ group, onBack }) {
  const [joined, setJoined] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error,setError]=useState(null);
  const user=localStorage.getItem("userId")

  
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

 async function handleJoin() {
    console.log("called the join")
    // Simulate API call
    apiClient.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem("token")}`;
    await _post('/api/socialmedia/groups/join',{groupId:group._id}).then((response)=>{
      if(response.status==200)
      {
        setJoined(true);
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
    apiClient.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem("token")}`;
    await _post('/api/socialmedia/groups/request-join',{groupId:group._id}).then((response)=>{
      if(response.status==200)
      {
        console.log(response.data)
        console.log("request sent successfully")
        setRequested(true)
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
        group.groupType === 'public' ? (
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
      {requested && <p className="text-info mt-3">Join request sent successfully.</p>}
    </div>
  );
}

export default GroupDetails;
