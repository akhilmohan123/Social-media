import React, { useEffect, useState, useRef } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import axios from "axios";
import { Button } from "react-bootstrap";
import LoadingSpinnerComponent from "react-spinners-components";
import ImageGallery from "react-image-gallery";
import "./Profiledetails.css";
import "react-image-gallery/styles/css/image-gallery.css";
import Editprofile from "./Editprofile";
import { useNavigate } from "react-router-dom";
export default function Profiledetails() {
  const [data, setdata] = useState(null);
  const token = localStorage.getItem("token");
  let [color, setColor] = useState("#ffffff");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const imageGalleryRef = useRef(null);
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    backgroundColor: "#9de2ff",
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setdata(res.data.data);
      });
  }, [token]);
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "lightblue",
          textAlign: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
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
  console.log(data);
  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.image || !imageData.contentType) return "";
    return `data:${imageData.contentType};base64,${imageData.image}`;
  };
  if (!data) {
    return <div>Loading...</div>;
  }
  const handleProfileImageClick = () => {
    if (imageGalleryRef.current) {
      const profileImageSrc = getImageSrc(data.image);
      if (profileImageSrc) {
        // Create a single image item for the profile image
        const profileImageItem = {
          original: profileImageSrc,
          thumbnail: profileImageSrc,
        };
        // Set the gallery items and open full-screen
        imageGalleryRef.current.slideToIndex(0); // Assuming profile image is the first item
        imageGalleryRef.current.fullScreen();
      }
    }
  };
  function editProfile() {
    navigate("/edit-profile");
  }

  function handleimageclick(index) {
    if (imageGalleryRef.current) {
      imageGalleryRef.current.slideToIndex(index);
      imageGalleryRef.current.fullScreen();
    }
  }
  const images = data.friendpost.map((result) => ({
    original: getImageSrc(result),
    thumbnail: getImageSrc(result),
  }));
  function handleview(){
    navigate("/view-profile")
  }
  return (
    <div className="gradient-custom-2" style={{ backgroundColor: "#9de2ff" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: "#000", height: "200px" }}
              >
                <div
                  className="ms-4 mt-5 d-flex flex-column"
                  style={{ width: "150px" }}
                >
                  <MDBCardImage
                    src={getImageSrc(data.image)}
                    alt="Profile"
                    className="mt-4 mb-2 img-thumbnail"
                    fluid
                    style={{ width: "150px", zIndex: "1" }}
                    onClick={handleProfileImageClick}
                  />
                </div>
                <div
                  style={{
                    height: "250px",
                    position: "relative",
                    padding: "10px",
                  }}
                >
                  <Button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      padding: "5px",
                    }}
                    onClick={editProfile}
                  >
                    Edit
                  </Button>
                  <Button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "80px", // Adjust 'left' to position the button relative to the first one
                      padding: "5px",
                    }}
                    onClick={handleview}
                  >
                    View
                  </Button>
                </div>
                <div className="ms-3" style={{ marginTop: "130px" }}>
                  <MDBTypography tag="h5">
                    {data.Fname} {data.Lname}
                  </MDBTypography>
                </div>
              </div>
              <div
                className="p-4 text-black"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">
                      {data.totalpost}
                    </MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Photos
                    </MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">
                      {data.followers}
                    </MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Following
                    </MDBCardText>
                  </div>
                </div>
              </div>
              <MDBCardBody key={data.Fname} className="text-black p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">
                    Recent photos
                  </MDBCardText>
                </div>
                {data
                  ? data.friendpost.map((result, index) => (
                      <MDBRow>
                        <MDBCol className="mb-2">
                          <MDBCardImage
                            src={result ? getImageSrc(result) : ""}
                            alt="image 1"
                            className="w-100 rounded-3"
                            style={{
                              height: "300px",
                              minWidth: "300px",
                              objectFit: "contain",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = "scale(1.1)";
                            }} // Scale up on hover
                            onMouseOut={(e) => {
                              e.target.style.transform = "scale(1)";
                            }}
                            onClick={() => handleimageclick(index)}
                          />
                        </MDBCol>
                      </MDBRow>
                    ))
                  : ""}
                <ImageGallery
                  ref={imageGalleryRef}
                  items={images}
                  showThumbnails={true}
                  showFullscreenButton={true}
                  showPlayButton={false}
                  showBullets={true}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
