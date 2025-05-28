import React, { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardBody, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Friends.css'; // Create this CSS file for custom styles

function Friends({ friend, id }) {
  const token = localStorage.getItem("token");
  const friendId = friend._id;
  const navigate = useNavigate();
  
  // Follow state management
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

  async function handleFollowClick() {
    try {
      if (followState) {
        await axios.post(`http://localhost:3001/remove-friend/${friendId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:3001/add-friend/${friendId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="10" lg="8" xl="6">
            <MDBCard className="friend-card" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
              <MDBCardBody className="p-4">
                <div className="d-flex text-black">
                  <div className="flex-shrink-0">
                    <MDBCardImage
                      className="profile-image"
                      style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                      src={getImageSrc(friend.Image)}
                      alt='Profile image'
                      fluid
                    />
                  </div>
                  <div className="flex-grow-1 ms-4 d-flex flex-column justify-content-between">
                    <div>
                      <MDBCardTitle className="friend-name">
                        {friend.Fname} {friend.Lname}
                        {followState && <span className="verified-badge"><MDBIcon icon="check-circle" /></span>}
                      </MDBCardTitle>
                      <p className="friend-bio text-muted mb-3">
                        {friend.bio || "No bio available"}
                      </p>
                    </div>
                    
                    <div className="d-flex pt-1 friend-actions">
                      <Button 
                        variant={followState ? "outline-primary" : "primary"} 
                        className="follow-button"
                        onClick={handleFollowClick}
                      >
                        {followState ? (
                          <>
                            <MDBIcon icon="user-check" className="me-2" /> Following
                          </>
                        ) : (
                          <>
                            <MDBIcon icon="user-plus" className="me-2" /> Follow
                          </>
                        )}
                      </Button>
                      
                      {followState && (
                        <Button 
                          variant="outline-secondary" 
                          className="view-profile-button ms-2"
                          onClick={() => viewfriend(friend._id)}
                        >
                          <MDBIcon icon="eye" className="me-2" /> View Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Friends;