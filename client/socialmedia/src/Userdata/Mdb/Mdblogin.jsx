import {  useState } from 'react';
import axios from "axios";
import {
  
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import './Mdcss.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';



function Mdblogin() {
  const [value, setValue] = useState({ email: '', password: '' });
 
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      'Content-Type': 'application/json',
  
    }
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setValue((prevValue) => ({ ...prevValue, [name]: value }));
  }

  async function handleClick() {
    try {
      const data = await axiosInstance.post("/login", value);
      console.log(data)
      if (data.status === 200) {
        const token = data.data; // Assuming the token is sent back as data.token
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        console.log('Token received and set:', token);
        alert("Login successfully")
        navigate("/social");
       
      } else {
        alert("Login failed")
        navigate("/login");
     
      }
    } catch (error) {
      alert("login failed Wrong Email or Password")
      console.error('Error logging in:', error);
      navigate("/login");
    }
  }

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm='6'>
          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />
            <span className="h1 fw-bold mb-0">Logo</span>
          </div>
          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Log in</h3>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='formControlLg' type='email' size="lg" name='email' value={value.email} onChange={handleChange} />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='formControlLg' type='password' name='password' value={value.password} size="lg" onChange={handleChange} />
            <Button className="mb-4 px-5 mx-5 w-100" color='info' size='sm' onClick={handleClick}>Login</Button>
            <p className="small mb-5 pb-lg-3 ms-5"><a className="text-muted" href="#!">Forgot password?</a></p>
            <p className='ms-5'>Don't have an account? <a href="/Signup" className="link-info">Register here</a></p>
          </div>
        </MDBCol>
        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login image" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Mdblogin;
