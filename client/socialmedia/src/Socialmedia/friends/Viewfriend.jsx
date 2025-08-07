import React, { useEffect, useState, useRef } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css';
import LoadingSpinnerComponent from 'react-spinners-components';
import './ViewFriend.css'; // Create this CSS file for custom styles
import socket from '../Socket/Socket';

export default function ViewFriend() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageGalleryRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const user=localStorage.getItem("userId")
  // window.addEventListener("load", () => {
  //     socket.connect()
  //     socket.emit("new-user-add",user)
  //   });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/view-friend-profile/${id}`);
        setData(response.data.data);
        console.log(response.data.data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friend data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinnerComponent
          type={'DualBall'}
          color={'#3498db'}
          size={150}
          bgColor={'#f8f9fa'}
        />
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.image || !imageData.contentType) return '/default-profile.png';
    return `data:${imageData.contentType};base64,${imageData.image}`;
  };

  function handleImageClick(index) {
    if (imageGalleryRef.current) {
      imageGalleryRef.current.slideToIndex(index);
      imageGalleryRef.current.fullScreen();
    }
  }

  const images = data.friendpost.map(result => ({
    original: getImageSrc(result),
    thumbnail: getImageSrc(result),
  }));

  function handleMessageClick(id) {
    navigate(`/chat-friend/${id}`);
  }

  return (
    <div className="view-friend-container">
      <MDBContainer className="profile-container">
        <MDBRow className="justify-content-center">
          <MDBCol lg="10" xl="8">
            <MDBCard className="profile-card">
              {/* Profile Header */}
              <div className="profile-header">
                <div className="profile-avatar-container">
                  <MDBCardImage 
                    src={getImageSrc(data.image)}
                    alt="Profile" 
                    className="profile-avatar"
                  />
                </div>
                <div className="profile-info">
                  <MDBTypography tag="h2" className="profile-name">
                    {data.Fname} {data.Lname}
                  </MDBTypography>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-count">{data.totalpost}</span>
                      <span className="stat-label">Posts</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-count">{data.followers}</span>
                      <span className="stat-label">Followers</span>
                    </div>
                    <Button 
                      variant="primary" 
                      className="message-button"
                      onClick={() => handleMessageClick(id)}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              <MDBCardBody className="gallery-section">
                <div className="gallery-header">
                  <MDBTypography tag="h5" className="gallery-title">
                    Recent Photos
                  </MDBTypography>
                </div>
                
                <MDBRow className="gallery-grid">
                  {data.friendpost.map((friend, index) => (
                    <MDBCol md="4" className="gallery-item" key={index}>
                      <MDBCardImage 
                        src={getImageSrc(friend)}
                        alt={`Post ${index + 1}`} 
                        className="gallery-image"
                        onClick={() => handleImageClick(index)}
                      />
                    </MDBCol>
                  ))}
                </MDBRow>

                <ImageGallery 
                  ref={imageGalleryRef} 
                  items={images} 
                  showThumbnails={false} 
                  showFullscreenButton={true} 
                  showPlayButton={false} 
                  showBullets={false} 
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}