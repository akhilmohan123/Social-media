import React, { useEffect, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateShowCreategroup } from '../../Redux/SocialCompent';
import { toast } from 'react-toastify';
import { _post,apiClient } from '../axios/Axios';
import socket from '../Socket/Socket';
function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image,setImage]=useState('');
  const showGroup = useSelector((state) => state.Social.showCreategroup);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  //for dummy purpose only
  function handleClose() {
    dispatch(updateShowCreategroup(false));
  }
  

  const handleSubmit = async (e) => {
    try {
      
       e.preventDefault();
    console.log({name,description,type });
    if(!name || !description || ! type)
    {
      //set error messages
      setError({
        name: !name && 'Group name is required',
        description: !description && 'Description is required',
        type : !type && 'Group type is required'
      })
    }
    //if all fields are filled process with api call
    let formData=new FormData();
    formData.append("name",name);
    formData.append("description",description);
    formData.append("type",type);
    formData.append("image",image);
    console.log("formData is ",formData);


    //setting the token in header
    await _post("/group/create",formData).then((response)=>{
       console.log(response.data);

    //if group created successfully then close the modal and show success message
    if(response)
    {
      toast.success("Group Created Successfully")
      handleClose();
      socket.emit("createGroup",{
        groupID:response.data,
        admin:localStorage.getItem("userId"),
      })
    }
    //if group creation failed then show the error message
    else{
      toast.error("Failed to create group")
    }
    });
   
    } catch (error) {
      toast.error("An error occured while creating the group");
      console.error("Error creating group:",error); 
    }
   
  };
  useEffect(()=>{
    if(error.name || error.description || error.type)
    {
        toast.error("Please fill all the fields correctly")
    }
  },[error])

  return (
    <Modal show={showGroup} onHide={handleClose} size="lg" className="add-photo-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Create Group</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="groupName">
            <Form.Label style={{ color: 'black' }}>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="groupImage">
            <Form.Label style={{ color: 'black' }}>Group Image</Form.Label>
            <Form.Control
              type="file"
              placeholder="upload group image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="groupDescription">
            <Form.Label style={{ color: 'black' }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write something about the group"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'black' }}>Group Type</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select group type</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateGroup;
