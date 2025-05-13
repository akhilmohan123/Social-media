import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cropper from 'react-easy-crop';
import getCroppedImage from './CroppedImage';
import Dropdown from 'react-bootstrap/Dropdown';
import './AddPhoto.css';
import { use } from 'react';
import { Axios } from 'axios';
import { _post, apiClient } from '../axios/Axios';

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
  const [latitude,setLatitude]= useState(null);
  const [longitude,setLongitude]=useState(null);
  const [error,setError] =useState(null);
  const [suggestions,setSuggestions]=useState([]);
  const [selectSuggestion,setSelectSuggestion]=useState(null);
  const [dropdownShow,setDropdownShow] = useState(true)
   const API_KEY=import.meta.env.VITE_FOURSQUARE_API
  useEffect(()=>{
    suggestions.length>0 &&suggestions.map((s)=>{
      console.log("suggestion is ========",s.name);
    })
  },[suggestions]);


  useEffect(()=>{
    console.log("api key is =====",API_KEY)
  },[])

  useEffect(()=>{
    console.log(imageData);
    console.log(typeof imageData)
  })
 

   useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

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
    try {
    fetch(croppedImageData).then((response)=>{
      response.blob().then((blob)=>{
      var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
     var base64data = reader.result;                
      console.log(base64data);
      setCroppedImageData(base64data);}
      })
    })
    console.log(caption);
    console.log(location);
    const token=localStorage.getItem("token");
    apiClient.defaults.headers.common["Authorization"]=`Bearer ${token}`;
    const formData=new FormData();
    formData.append("image",croppedImageData);
    formData.append("caption",caption);
    formData.append("location",location)
     _post("/social/add-post",formData).then((res)=>{
      console.log(res);

     })
    } catch (error) {
     console.log(error); 
    }
   
  };
  const getPlaces =async(place,latitude,longitude)=>{
     const res = await fetch(
    ` https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=1000&query=${place}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: API_KEY, // Replace with your real key
      },
    }
  );
  const data = await res.json();
  console.log("dats is ========",data.results);
  if(data.results.length>0){
    setSuggestions(data.results)
  }else{
    setError("Location not found");
  }
  }
  const handleLocation = (value) =>{
    console.log("place value is ====="+value);
    setLocation(value);
    if(latitude && longitude){
      getPlaces(value,latitude,longitude);
    }
    else{
      setError("Location not found");
    }
  }
  const handlePlace = (value) =>{
    setSelectSuggestion(value);
    setDropdownShow(false);
    setLocation(value);
    setSuggestions([]);
  }
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
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Where was this taken?"
                  value={location}
                  onChange={(e) => handleLocation(e.target.value)}
                />
                {suggestions.length>0 && (
                  <Dropdown.Menu show  style={{with:'100%'}}>
                    {suggestions.map((suggestion,index)=>(
                      <Dropdown.Item key={suggestion.fsq_id} onClick={()=>handlePlace(suggestion.name)}>
                        {suggestion.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                )}
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