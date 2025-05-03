import React, { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardBody, MDBCardImage } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Viewfriend from './Viewfriend';
import { useNavigate } from 'react-router-dom';
function Friends({ friend, id }) {
  const token = localStorage.getItem("token");
  const friendId = friend._id; // Assuming friend._id is used for the friend's ID
  const navigate=useNavigate()
  useEffect(() => {
    // Load follow state from localStorage on component mount
    const isFriendFollowed = localStorage.getItem(`followed_${id}_${friendId}`);
    console.log(`Loaded follow state for user ${id} and friend ${friendId}:`, isFriendFollowed);
    if (isFriendFollowed !== null) {
      setFollowState(isFriendFollowed === 'true');
    }
  }, [id, friendId]);
  const [followState, setFollowState] = useState(() => {
    const isFriendFollowed = localStorage.getItem(`followed_${id}_${friendId}`);
    return isFriendFollowed === 'true';
  });
  async function handleFollowClick() {
    try {
      if (followState) {
        await axios.post(`http://localhost:3001/remove-friend/${friendId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`http://localhost:3001/add-friend/${friendId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      // Update local state and localStorage
      const newFollowState = !followState;
      setFollowState(newFollowState);
      localStorage.setItem(`followed_${id}_${friendId}`, newFollowState.toString());
      console.log(`Updated follow state for user ${id} and friend ${friendId}:`, newFollowState);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.image || !imageData.contentType) return '';
    return `data:${imageData.contentType};base64,${imageData.image}`;
  };
  function viewfriend(id){
   navigate(`/view-friend/${id}`)
  }
  return (
    <div>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5">
            <MDBCard style={{ borderRadius: '15px' }}>
              <MDBCardBody className="p-4">
                <div className="d-flex text-black">
                  <div className="flex-shrink-0">
                    <MDBCardImage
                      style={{ width: '180px', borderRadius: '10px' }}
                      src={getImageSrc(friend.Image)}
                      alt='Generic placeholder image'
                      fluid
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <MDBCardTitle>{friend.Fname} {friend.Lname}</MDBCardTitle>
                    <div className="d-flex justify-content-start rounded-3 p-2 mb-2" style={{ backgroundColor: '#efefef' }}>
                     
                    </div>
                    <div className="d-flex pt-1">
                      <Button key={friend._id} style={{height:'50px'}}onClick={handleFollowClick}>{followState ? "Followed" : "Follow"}</Button>
                    {followState?<Button style={{ margin: 'auto',height:'50px' }} onClick={()=>viewfriend(friend._id)}>View profile</Button>:''} 
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
