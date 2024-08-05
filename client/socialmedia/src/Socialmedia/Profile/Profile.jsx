import React from 'react'
import Socialheader from '../Socialheader'
import Profiledetails from './Profiledetails'

function Profile() {
  return (
    <div style={{backgroundColor:'white', height:'100vh',width:'100vw'}}>
        <Socialheader value={true}/>
         <Profiledetails/>

    </div>
  )
}

export default Profile
