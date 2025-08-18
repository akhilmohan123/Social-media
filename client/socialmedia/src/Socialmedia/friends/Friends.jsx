import React, { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardBody, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Friends.css';
import { _post } from '../axios/Axios';

function Friends({ friend, id }) {
  const friendId = friend._id;
  const navigate = useNavigate();
  
  const [followState, setFollowState] = useState(() => {
    const isFriendFollowed = localStorage.getItem(`followed_${id}_${friendId}`);
    return isFriendFollowed === 'true';
  });

  useEffect(() => {
    const isFriendFollowed = localStorage.getItem(`followed_${id}_${friendId}`);
    if (isFriendFollowed !== null) {
      setFollowState(isFriendFollowed === 'true');
    }
  }, [id, friendId]);


  useEffect(()=>{
    console.log("Follow state is ====="+followState)
  },[followState])

  async function handleFollowClick() {
    try {
      if (followState) {
        await _post(`http://localhost:3001/remove-friend/${friendId}`, {});
      } else {
        let response=await _post(`http://localhost:3001/add-friend/${friendId}`, {});
        console.log("Response from add friend is ",response)
      }
      const newFollowState = !followState;
      setFollowState(newFollowState);
      localStorage.setItem(`followed_${id}_${friendId}`, newFollowState.toString());
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.image || !imageData.contentType) return '/default-profile.png';
    return `data:${imageData.contentType};base64,${imageData.image}`;
  };

  function viewfriend(id) {
    navigate(`/view-friend/${id}`);
  }

  return (
    <div className="friend-card-container">
      <MDBCard className="friend-card">
        <div className="card-horizontal">
          <div className="img-square-wrapper">
            <MDBCardImage
              className="profile-image"
              src={getImageSrc(friend.Image)}
              alt='Profile image'
              fluid
            />
          </div>
          <div className="card-body">
            <div className="friend-header">
              <MDBCardTitle className="friend-name">
                {friend.Fname} {friend.Lname}
                {followState && <span className="verified-badge"><MDBIcon icon="check-circle" /></span>}
              </MDBCardTitle>
              <span className="friend-status">{followState ? 'Following' : 'Not Following'}</span>
            </div>
            
            <p className="friend-bio">
              {friend.bio || "This user hasn't written a bio yet."}
            </p>
            
            <div className="friend-stats">
              <div className="stat-item">
                <MDBIcon icon="calendar" className="me-2" />
                <span>Joined {new Date(friend.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="friend-actions">
              <Button 
                variant={followState ? "outline-primary" : "primary"} 
                className="action-button"
                onClick={handleFollowClick}
              >
                {followState ? 'Following' : 'Follow'}
              </Button>
              
              <Button 
                variant="outline-secondary" 
                className="action-button"
                onClick={() => viewfriend(friend._id)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </MDBCard>
    </div>
  );
}

export default Friends;