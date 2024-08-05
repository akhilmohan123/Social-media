import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Conversation({data,currentuserid}) {
    const[userdata,setUserdata]=useState(null)
    const id=data.members.find((id)=>id!=currentuserid)
   
    useEffect(()=>{
        async function userdetails(){
            try {
                const result= await axios.get(`http://localhost:3001/get-friend/${id}`).then(res=>{
                    console.log(res)
                    setUserdata(res.data)
                })
            } catch (error) {  
            }
          
        }
        userdetails()
    

    },[])
    const getImageSrc = (imageData) => {
        if (!imageData || !imageData.image || !imageData.contentType) return '';
        return `data:${imageData.contentType};base64,${imageData.image}`;
      };
  return (
    <>
    <div className='follower-conversation'>
      <div>
        <div className='online-dot'></div>
        <img src={userdata?getImageSrc(userdata.Image):''}className='followerImage'style={{width:'50px',height:'50px',borderRadius:'20px'}}></img>
        <div className='name'style={{fontSize:"0.8rem"}}>
            <span>{userdata?userdata.Fname:''}{" "}{userdata?userdata.Lname:''}</span>
            <span>Online</span>
            </div>
      </div>
    </div>
    <hr style={{width:'85%',border:'0.1px solid #ececec'}}/>
    </>
  )
}

export default Conversation
