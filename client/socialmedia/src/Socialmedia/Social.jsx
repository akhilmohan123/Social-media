import React, { useEffect } from 'react'
import Socialheader from './Socialheader'
import Socialmiddle from './Socialmiddle'


function Social() {
  
  useEffect(() => {
    console.log("Checking URL for token...");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      alert("Token found: " + token);
      localStorage.setItem("token", token);
      console.log("Token stored:", token);

      // Remove ?token=... from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("No token in URL");
    }
  }, []);
  return (
    <div style={{backgroundColor:'white',height: '100vh', width: '100vw'}}>
       <Socialheader/>
       <Socialmiddle/>
       
    </div>
  )
}

export default Social
