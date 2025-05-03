import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { 
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import {toast} from 'react-toastify';


function Mdbsignup() {
  const [value, setValue] = useState({ fname: "", lname: "", email: "", password: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,Seterror]=useState({email:'',password:''})
  const navigate = useNavigate();
  const password_reg=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email_regex=/^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3001/google/authenticate";
  };

  function Onvalidation(){
  
    var valid=true;
    var newError={email:'',password:''}
    if(!password_reg.test(value.email)){
      newError.password='Please enter valid password';
      valid=false;
    } 

    if(!email_regex.test(value.email)) {
      newError.email='Please enter valid email';
      valid=false;
  }
  Seterror(newError)
  return valid
}

  function handleChange(e) {
    const { name, value } = e.target;
    setValue((prevValue) => ({ ...prevValue, [name]: value }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file);
  }

  async function handleSubmit(e) {

 
    e.preventDefault();
    if(Onvalidation()){
      
      setLoading(true);
    
      const form = new FormData();
      form.append('fname', value.fname);
      form.append('lname', value.lname);
      form.append("password", value.password);
      form.append("email", value.email);
      if (image) form.append('file', image);
  
      try {
        const res = await axios.post("http://localhost:3001/signup", form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
  
        if (res.status === 200) {
          alert("Account Created Successfully!");
          navigate("/login");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }else{
      toast.error("Something went wrong !")
      alert("NO !!!!")
    }
   
  }

  return (
    <MDBContainer fluid className="p-0 overflow-hidden">
      {/* Hero Image with Overlay */}
      <div className="bg-image position-relative" style={{
        backgroundImage: 'url(images/signup.jpg)',
        height: '300px',
        backgroundPosition: 'center'
      }}>
        <div className="mask" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <h1 className="text-white mb-0">Join Our Community</h1>
          </div>
        </div>
      </div>

      {/* Signup Card */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-md-5 mx-2"
        style={{ marginTop: '-80px' }}
      >
        <MDBCard className='shadow-5' style={{
          background: 'hsla(0, 0%, 100%, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <MDBCardBody className='p-md-5 p-4'>
            <h2 className="fw-bold mb-4 text-center">Create Your Account</h2>

            {/* Google Signup Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <MDBBtn 
                color='light' 
                className='w-100 mb-4 d-flex align-items-center justify-content-center'
                onClick={handleGoogleSignup}
                style={{ height: '45px' }}
              >
                <FcGoogle size={20} className="me-2" />
                Continue with Google
              </MDBBtn>
            </motion.div>

            <div className="divider d-flex align-items-center my-4">
              <p className="text-center mx-3 mb-0 text-muted">or register with email</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit}>
              <MDBRow>
                <MDBCol md='6' className='mb-3'>
                  <MDBInput 
                    label='First name' 
                    id='fname' 
                    type='text'
                    name='fname' 
                    value={value.fname}
                    onChange={handleChange}
                    required
                  />
                </MDBCol>

                <MDBCol md='6' className='mb-3'>
                  <MDBInput 
                    label='Last name' 
                    id='lname' 
                    type='text'
                    name='lname'
                    value={value.lname}
                    onChange={handleChange}
                    required
                  />
                </MDBCol>
              </MDBRow>

              <MDBInput 
                wrapperClass='mb-3' 
                label='Email' 
                id='email' 
                type='email'
                name='email' 
                value={value.email}
                onChange={handleChange}
                required
              />
              {error.email && <p style={{color:'red'}}>{error.email}</p>}

              <MDBInput 
                wrapperClass='mb-3' 
                label='Password' 
                id='password' 
                type='password'
                name='password' 
                value={value.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              {error.password && <p style={{color:'red'}}>{error.password}</p>}

              <div className='mb-4'>
                <label htmlFor="profileImage" className="form-label">Profile Image (Optional)</label>
                <input 
                  className="form-control" 
                  type="file" 
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>

              <MDBBtn 
                type='submit'
                className='w-100 mb-3' 
                color='primary'
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </MDBBtn>
            </form>

            <div className="text-center">
              <p className="mb-0">Already have an account? 
                <a href="/login" className="text-primary ms-1">Login here</a>
              </p>
            </div>
          </MDBCardBody>
        </MDBCard>
      </motion.div>
    </MDBContainer>
  );
}

export default Mdbsignup;