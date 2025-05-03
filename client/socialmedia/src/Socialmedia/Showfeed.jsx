import React from 'react'
import logo from './Post1.jpg'
import { Button, Card } from 'react-bootstrap';
import Like from './Like';
import Mdblogin from '../Userdata/Mdb/Mdblogin';
import { useNavigate } from 'react-router-dom';

function Showfeed({name,image,description,like,postid}) {
  const navigate=useNavigate()
  const token=localStorage.getItem("token")
  console.log(token)
  if(!token){
      navigate('/login')
  }
 
   
  return (
   
    <div>
      
       <div className="feed d-flex justify-content-center align-items-center">
      <Card style={{ width: '50rem' }}>
        <Card.Img variant="top" src={getImageSrc(image)} style={{ height: '85vh',objectFit: 'cover'}} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{description}</Card.Text>
         <Like like={like} postid={postid}/> 
        </Card.Body>
      </Card>  
    </div>
      
    </div>
  )
}

export default Showfeed
