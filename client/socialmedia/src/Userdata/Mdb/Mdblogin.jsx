import { useEffect, useState } from 'react';
import axios from "axios";
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import './Mdcss.css';

function Mdblogin() {
  const [value, setValue] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const api_url=import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
    headers: { 'Content-Type': 'application/json' }
  });

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setValue((prevValue) => ({ ...prevValue, [name]: value }));
  }

  async function handleClick() {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/login", value);
      if (data.token) {
        localStorage.setItem('token', data.token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        navigate("/social");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Wrong email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MDBContainer fluid className="login-container">
      <MDBRow className="g-0">
        {/* Left Column (Form) */}
        <MDBCol md='6' className="d-flex align-items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-100 py-5 px-md-5"
          >
            <div className="text-center mb-4">
              <MDBIcon fas icon="crow" size="3x" className="me-3" style={{ color: '#709085' }} />
              <span className="h1 fw-bold mb-0">SocialApp</span>
            </div>

            <h3 className="text-center mb-4" style={{ letterSpacing: '1px' }}>Welcome Back!</h3>

            {/* Email/Password Form */}
            <MDBInput
              wrapperClass='mb-4'
              label='Email address'
              id='formControlLg'
              type='email'
              size="lg"
              name='email'
              value={value.email}
              onChange={handleChange}
              contrast
            />

            <MDBInput
              wrapperClass='mb-4'
              label='Password'
              id='formControlLg'
              type='password'
              name='password'
              value={value.password}
              size="lg"
              onChange={handleChange}
              contrast
            />

            <Button
              className="w-100 mb-3 py-2"
              variant="primary"
              size="lg"
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="divider d-flex align-items-center my-4">
              <p className="text-center mx-3 mb-0 text-muted">or connect with</p>
            </div>

            {/* Google Login Button - Moved Below */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline-primary"
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={handleGoogleLogin}
                style={{
                  height: '45px',
                  borderColor: '#ddd',
                  backgroundColor: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <FcGoogle size={18} className="me-2" />
                Continue with Google
              </Button>
            </motion.div>

            <div className="text-center mt-4">
              <a href="#!" className="text-muted small">Forgot password?</a>
              <p className="mt-3">
                Don't have an account? <a href="/Signup" className="text-primary">Register here</a>
              </p>
            </div>
          </motion.div>
        </MDBCol>

        {/* Right Column (Social Media-themed Image) */}
        <MDBCol md='6' className="d-none d-md-block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-100"
          >
            <img
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
              alt="People connecting on social media"
              className="w-100 h-100"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </motion.div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Mdblogin;