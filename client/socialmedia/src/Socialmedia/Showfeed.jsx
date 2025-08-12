import React, { useEffect } from "react";
import logo from "./Post1.jpg";
import { Button, Card } from "react-bootstrap";
import Like from "./Like";
import Mdblogin from "../Userdata/Mdb/Mdblogin";
import { useNavigate } from "react-router-dom";

function Showfeed({
  name = "default",
  image = "sample.png",
  description = "nothing",
  like = 0,
  postid = 2,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    navigate("/login");
  }

  const getImageSrc = (img) => {
    if (typeof img === "string" && img.trim() !== "") {
      return img;
    }
    return "/default-image.png";
  };

  useEffect(()=>{
    console.log("show feed is called")
    console.log("name is "+name)
    console.log("image is "+image)
    console.log("description is "+description)
    console.log("like is "+like)
    console.log("postid is "+postid)
  },[name,image,description,like,postid])

  return (
    <div>
      <div className="feed d-flex justify-content-center align-items-center">
        <Card style={{ width: "50rem" }}>
          <Card.Img
            variant="top"
            src={getImageSrc(image)}
            style={{ height: "85vh", objectFit: "cover" }}
          />
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description}</Card.Text>
            <Like like={like} postid={postid} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Showfeed;
