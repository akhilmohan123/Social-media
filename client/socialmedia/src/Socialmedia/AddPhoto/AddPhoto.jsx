import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Cropper from 'react-easy-crop';

function AddPhoto({ imageData }) {
  const [show, setShow] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pixelComplete, setPixelcomplete] = useState(null);

  useEffect(() => {
    console.log("Received image data:", imageData);
  }, [imageData]);

  const handleClose = () => setShow(false);

  function onCropComplete(croppedArea, pixelComplete) {
    setPixelcomplete(pixelComplete);
    console.log("Cropped pixel area:", pixelComplete);
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ position: 'relative', height: 400, background: '#333' }}>
        <Cropper
          image={imageData}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Modal.Body>

      <Modal.Body className="d-flex flex-column gap-3">
        <div>
          <label>Zoom</label>
          <input
            type='range'
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Rotation</label>
          <input
            type='range'
            min={0}
            max={360}
            step={1}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddPhoto;
