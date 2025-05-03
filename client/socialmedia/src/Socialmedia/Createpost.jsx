import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [imageFile,setImageFile]=useState(null)
  const [sucees,issucess]=useState(false)
  const handleSubmit =async (event) => {
    event.preventDefault();
    // Handle form submission logic here, including sending postContent and imageFile to server
    const formData = new FormData();
    formData.append('content', postContent);
    formData.append('file', imageFile);
    console.log('Posting:', postContent);
    console.log('Image file:', imageFile);
    console.log(formData)
    // Reset form fields if needed
    setPostContent('');
    setImageFile(null);
    const token = localStorage.getItem('token');
    try {
      console.log(formData)
      await axios.post("http://localhost:3001/post",formData,{
        headers:{
              'Authorization':`Bearer ${token}`,
        }
      }).then((res)=>{issucess(res.data.data)
        alert("Post added")
      })
    } catch (error) {
      alert(error)
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    
  };
  return (
    <div className="create-post">
      <h3>Create Post</h3>
      <Form onSubmit={handleSubmit} encType='multipart/form-data'>
        <Form.Group className="mb-3">
          <Form.Label>Post Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file"name='file' accept="image/*" onChange={handleImageChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Post
        </Button>
      </Form>
    </div>
  );
}

export default CreatePost;

