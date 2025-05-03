import React, { useEffect, useState,useRef } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import axios from 'axios';
import {useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css';
import LoadingSpinnerComponent from 'react-spinners-components';
export default function Viewfriend() {
   const [data,setdata]=useState(null);
   let [color, setColor] = useState("#ffffff");
   const [loading, setLoading] = useState(true);
   const imageGalleryRef = useRef(null);
   const navigate=useNavigate()
   const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    backgroundColor:'#9de2ff'
  };
const match=useParams('/view-friend/:id')
let id=match.id
  useEffect(()=>{
  axios.get(`http://localhost:3001/view-friend-profile/${id}`).then(res=>{
       setdata(res.data.data) 
       setLoading(false)
    })
  },[id])
  if (loading) {
    return (
      <div style={{ backgroundColor: 'lightblue', textAlign: 'center', height:'100vh', width:'100vw'}}>
        <LoadingSpinnerComponent
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }
  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.image || !imageData.contentType) return '';
    return `data:${imageData.contentType};base64,${imageData.image}`;
  };
  function handleimageclick(index){
    if (imageGalleryRef.current) {
      imageGalleryRef.current.slideToIndex(index);
      imageGalleryRef.current.fullScreen();
    }
   }
   
  
  const images = data.friendpost.map(result => ({
    original: getImageSrc(result),
    thumbnail: getImageSrc(result),
  }));
  function getfriendid(id){
    navigate(`/chat-friend/${id}`)
  }
  return (
    
    <div className="gradient-custom-2" style={{ backgroundColor: '#9de2ff' }}>

      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                <MDBCardImage 
                    src={data?getImageSrc(data.image):''}
                    alt="Profile" 
                    className="mt-4 mb-2 img-thumbnail" 
                    fluid 
                    style={{ width: '150px', zIndex: '1' ,height:"300px", minWidth: '300px', objectFit:"contain",transition: 'transform 0.2s'}} onMouseOver={(e) => { e.target.style.transform = 'scale(1.1)'; }} // Scale up on hover
                    onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }} 
                 />
                 
    
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  {data?<MDBTypography tag="h5">{data.Fname}{ " "}{data.Lname}</MDBTypography>:<MDBTypography tag="h5">''</MDBTypography>}
               
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                   
                    <MDBCardText className="mb-1 h5">{data?data.totalpost:''}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">{data?data.followers:''}</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                  </div>
                  <div className="px-3">
                    <Button onClick={()=>getfriendid(id)}>Message</Button>
                    </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                  {/* <MDBCardText className="mb-0"><a href="#!" className="text-muted">Show all</a></MDBCardText> */}
                </div>
                <MDBRow>
                    {data?data.friendpost.map((friend,index)=>( <MDBCol key={index} className="mb-2">
                 <MDBCardImage src={friend?getImageSrc(friend):''}
                   alt="image 1" className="w-100  rounded-3" style={{height:"300px", minWidth: '300px', objectFit:"contain",transition: 'transform 0.2s'}} onMouseOver={(e) => { e.target.style.transform = 'scale(1.1)'; }} // Scale up on hover
                   onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }} onClick={()=>handleimageclick(index)}/>
                   </MDBCol>
                   )):''} 
                    <ImageGallery ref={imageGalleryRef} items={images} showThumbnails={false} showFullscreenButton={true} showPlayButton={false} showBullets={false} />
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );

}