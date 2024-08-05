import axios from 'axios';
import React, { useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';

function Detailprofile({image,description,name,like,postid}) {
   
  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.image || !imageData.contentType) return '';
    return `data:${imageData.contentType};base64,${imageData.image}`;
  };
  function handleDelete(){
    try {
      axios.delete(`http://localhost:3001/delete-post/${postid}`,{
       
      }).then(res=>{
       
      })
    } catch (error) {
      
    }
  }
 
  return (
    
    <div className="feed d-flex justify-content-center align-items-center">
      <Card style={{ width: '50rem' }}>
        <Card.Img variant="top" src={getImageSrc(image)} style={{ height: '85vh', objectFit: 'cover' }} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Text> {like} Likes</Card.Text>
            
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Detailprofile;
