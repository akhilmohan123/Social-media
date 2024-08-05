import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import style from "./socialheader.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from './live-chat.png'
function Socialheader({ value }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
   const navigate=useNavigate()
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
function chatclick(){
  navigate("/message-ai")
}
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  function handlelogout(){
    localStorage.removeItem("token")
    navigate('/login')
  }
  const search = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await axios.get(`http://localhost:3001/user/sea?query=${searchQuery}`);
        console.log(response.data)
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <div className={style.textcolor}>
      <Navbar expand="lg" className="bg-dark navigation">
        <Container>
          <Navbar.Brand href="#home" className="text-light"style={{marginBottom:'5px'}}>
            E-Social
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/profile" className="text-light">
                Profile
              </Nav.Link>
              <Nav.Link href="/login" className="text-light">
                Login
              </Nav.Link>
              <NavDropdown
                title={<span style={{color:"white"}}>Click</span>}
                id="basic-nav-dropdown"
                className="text-light"
               >
                <NavDropdown.Item href="/signup" className=" bg-dark text-light">
                  Signin
                </NavDropdown.Item>
                <NavDropdown.Item href="/friends" className=" bg-dark text-light">
                  Friends
                </NavDropdown.Item>
                <NavDropdown.Item className=" bg-dark text-light" onClick={handlelogout}>
                  Logout
                </NavDropdown.Item>
                <NavDropdown.Item href="/profile-add" className=" bg-dark text-light">
                  Add profile
                </NavDropdown.Item>
              </NavDropdown>
             <img src={image} style={{height:'30px', marginLeft:'10px',marginBottom:'5px',marginTop:'6px'}}onClick={chatclick}></img>
             <span style={{padding:'10px'}}>AiBot</span>
              {/* {!value && (
                <>
                  <input
                    type="text"
                    placeholder="Search"
                    style={{ width: '50rem', borderRadius: '20px', border: '1px solid black', paddingLeft: '10px' }}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  
                  <button
                    style={{ boxShadow: '10', borderRadius: '20px' }}
                    onClick={search}
                  >
                    Search
                  </button>
                </>
              )} */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        {/* {searchResults.length > 0 && (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {searchResults.map((result) => (
              <li key={result._id} style={{color:'black', margin: '10px 0', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <p><strong>Name:</strong> {result.Fname} {result.Lname}</p>
                <p><strong>Email:</strong> {result.Email}</p>
              </li>
            ))}
          </ul>
        )} */}
     
      </div>
    </div>
  );
}

export default Socialheader;
