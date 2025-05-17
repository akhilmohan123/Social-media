import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cropper from 'react-easy-crop';
import Dropdown from 'react-bootstrap/Dropdown';
 import { ToastContainer, toast } from 'react-toastify';
import { Container } from 'react-bootstrap';
import './Live.css'
import VideoContainer from './VideoContainer/VideoContainer';
function Live() {
    const [show,setShow] =useState(true)
  return (
     <Modal show={show}  size="lg" centered className="add-photo-modal" id="add-photo-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Live Streaming</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <VideoContainer/>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
      </Modal.Footer>
    </Modal>
  )
}

export default Live
