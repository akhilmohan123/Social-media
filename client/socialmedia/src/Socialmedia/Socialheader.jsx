import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import style from "./socialheader.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from './live-chat.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faCommentDots,faBell,faRobot } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";
import Notificationbell from "./Notification/Notificationbell";
function Socialheader({ value }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const liveStat=useSelector(state => state.Live.LiveStatus)
  const live=useSelector(state=>state.Live.LiveStatus)
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
      <Navbar expand="lg" className="bg-light rounded-4 navigation">
        <Container
          fluid
          className="d-flex align-items-center justify-content-between"
        >
          {/* Left: Logo + Label */}
          <Navbar.Brand
            href="#home"
            className="text-dark d-flex align-items-center"
            style={{ marginBottom: "5px" }}
          >
            <img
              src="/images/logo.png"
              className={`${style.image} me-2`}
              alt="Logo"
            />
            <span className="text-dark fw-bold">Friends</span>
          </Navbar.Brand>

          {/* Center: Search Bar */}
          <div className="mx-auto d-flex align-items-center bg-white rounded px-2">
            <FontAwesomeIcon icon={faSearch} className="text-dark me-2" />
            <input
              type="text"
              placeholder="Search for friends, groups, pages"
              className="form-control border-0 bg-white text-dark"
              style={{ width: "500px", outline: "none" }}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Right: Icons */}
          <div className="d-flex align-items-center gap-4">

            {/* Notification Bell */}

           {/* <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => console.log("Notifications clicked")}
             >
            <FontAwesomeIcon
               icon={faBell}
               className="text-dark"
               style={{ fontSize: "1.4rem" }}
            />
            {live &&   <span
             style={{
             position: "absolute",
             top: "0px",
             right: "0px",
             width: "8px",
             height: "8px",
             backgroundColor: "red",
             borderRadius: "50%",
             border: "2px solid white", // optional for a cleaner dot with outline
             display: "inline-block",
             }}
             ></span>}
          
            </div> */}
            <Notificationbell/>
            {/* Message Icon */}
            <FontAwesomeIcon
              icon={faCommentDots}
              className="text-dark"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
              onClick={chatclick}
            />

            {/* AI Bot Icon */}
            <div
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={chatclick}
            >
              <FontAwesomeIcon
                icon={faRobot}
                className="text-dark"
                style={{ fontSize: "1.5rem" }}
              />
              <span className="ms-2 text-dark fw-medium">AiBot</span>
            </div>

            {/* Profile Picture */}
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="rounded-circle"
              style={{
                width: "35px",
                height: "35px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => navigate("/profile")}
            />
          </div>
        </Container>
      </Navbar>

      {/* Optional: Show search results (currently disabled) */}
      {/* <div>
        {searchResults.length > 0 && (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {searchResults.map((result) => (
              <li
                key={result._id}
                style={{
                  color: "black",
                  margin: "10px 0",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <p>
                  <strong>Name:</strong> {result.Fname} {result.Lname}
                </p>
                <p>
                  <strong>Email:</strong> {result.Email}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}

export default Socialheader;
