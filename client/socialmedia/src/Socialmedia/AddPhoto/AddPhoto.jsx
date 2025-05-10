import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cropper from 'react-easy-crop';
import getCroppedImage from './CroppedImage';
import './AddPhoto.css';

function AddPhoto({ imageData }) {
  const [show, setShow] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pixelCrop, setPixelCrop] = useState(null);
  const [croppedImageData, setCroppedImageData] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [showCropper, setShowCropper] = useState(true); // Renamed for clarity

  useEffect(() => {
    console.log('Received image data:', imageData);
  }, [imageData]);

  function handleBack() {
    setShowCropper(true);
  }

  function onCropComplete(croppedArea, croppedAreaPixels) {
    setPixelCrop(croppedAreaPixels);
    console.log('Cropped pixel area:', croppedAreaPixels);
  }

  const handleSave = async () => {
    try {
      if (imageData && pixelCrop) {
        const croppedImageURL = await getCroppedImage(imageData, pixelCrop, rotation);
        setCroppedImageData(croppedImageURL);
        setShowCropper(false); // Hide cropper after saving
      }
    } catch (err) {
      console.error('Crop failed', err);
    }
  };

  const handleFinalSubmit = () => {
    console.log({
      image: croppedImageData,
      caption,
      tags: tags.split(',').map(tag => tag.trim()),
      location
    });
    handleBack();
  };

  return (
    <Modal show={show} onHide={handleBack} size="lg" centered className="add-photo-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Edit Photo</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {showCropper ? (
          <div className="cropper-container">
            <div className="crop-wrapper" style={{ position: 'relative', height: 400, background: '#f5f5f5' }}>
              <Cropper
                image={imageData}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={false}
                style={{
                  containerStyle: {
                    borderRadius: '8px'
                  }
                }}
              />
            </div>

            <div className="controls mt-4">
              <Form.Group className="mb-3">
                <Form.Label className="d-block fw-semibold mb-2">Zoom: {zoom.toFixed(1)}x</Form.Label>
                <Form.Range
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="d-block fw-semibold mb-2">Rotation: {rotation}°</Form.Label>
                <Form.Range
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />
              </Form.Group>
            </div>
          </div>
        ) : (
          <div className="preview-container">
            <div className="image-preview mb-4 text-center">
              {croppedImageData && (
                <img 
                  src={croppedImageData} 
                  alt="Cropped Preview" 
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: '300px' }} 
                />
              )}
            </div>
            
            <Form className="photo-metadata">
              <Form.Group className="mb-3">
                <Form.Label>Caption</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Add a meaningful caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tags (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="nature, vacation, summer"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Add relevant tags to help organize your photos
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Where was this taken?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
            </Form>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" onClick={handleBack}>
          Back
        </Button>

        {showCropper ? (
          <Button variant="primary" onClick={handleSave}>
            Continue
          </Button>
        ) : (
          <Button variant="primary" onClick={handleFinalSubmit}>
            Share
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AddPhoto;