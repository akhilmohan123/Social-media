import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Col, Container, Row, Image } from 'react-bootstrap';
import './Createpost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faSmile,
  faTags,
  faMapMarkerAlt,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import AddPhoto from './AddPhoto/AddPhoto';
import Live from './HandleLive/Live';
import { useDispatch, useSelector } from 'react-redux';
import { updateLivevideocontainer } from '../Redux/Bandwidthslice';

function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [image,setImage]=useState(false)
  const dispatch=useDispatch()
  const live=useSelector(state=>state.Live.liveVideo)
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('content', postContent);
    if (imageFile) formData.append('file', imageFile);

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post("http://localhost:3001/post", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setSuccess(res.data.data);
      alert("Post added");

      // Reset form
      setPostContent('');
      setImageFile(null);
    } catch (error) {
      alert("Error submitting post: " + error.message);
    }
  };

  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader=new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = ()=>{
      setImageFile(reader.result)
      setImage(true)
    }
  };

 
 
  function handleLive(){
    setImage(false)
    dispatch(updateLivevideocontainer(true))
   
  }

  return (
    <div>
 <Container className="bg-light p-4 rounded shadow-sm " >
      <div className="create-post">
        <h4 className="mb-4 text-dark">Welocome Akhil</h4>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Row 1: Profile + Text Area */}
          <Row className="align-items-start">
            <Col xs="auto">
              <Image src="images/logo.png" roundedCircle className="image-css" width="60" height="60" />
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2: Upload + Post Actions */}
          <Row className="mt-3">
  <Col className="d-flex justify-content-between flex-wrap gap-2 align-items-center">
    <div className="d-flex gap-2 flex-wrap">
      {/* Photo/Video with file input */}
      <Form.Group controlId="formFile" className="mb-0">
        <Form.Label className="btn btn-outline-secondary mb-0">
          <FontAwesomeIcon icon={faImage} className="me-2" />
          Photo/Video
          <Form.Control
            type="file"
            name="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </Form.Label>
      </Form.Group>

    </div>

    <div className="d-flex gap-2">
      <Button variant="danger" onClick={handleLive}>
        <FontAwesomeIcon icon={faVideo} className="me-2" />
        Go Live
      </Button>

      <Button type="submit" variant="primary" >Post</Button>
    </div>
  </Col>
</Row>

        </Form>
      </div>
    </Container>
    {image ? <AddPhoto imageData={imageFile}/> :<div></div>}
    {live?<Live/>:<div></div>}
    </div>
   
    
  );
}

export default CreatePost;
