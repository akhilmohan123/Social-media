import React, { useEffect, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateShowCreategroup } from '../../Redux/SocialCompent';
import { toast } from 'react-toastify';
function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const showGroup = useSelector((state) => state.Social.showCreategroup);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const token=localStorage.getItem("token")
  //for dummy purpose only
  let response=true
  function handleClose() {
    dispatch(updateShowCreategroup(false));
  }

  const handleSubmit = (e) => {
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

    let data={}
    data.name=name;
    data.description=description;
    data.type=type;
    data.token=token;
    
    if(response)
    {
      toast.success("Group Created Successfully")
      handleClose();
    }else{
      toast.error("Failed to create group")
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
