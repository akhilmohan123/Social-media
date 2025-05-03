import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Like({like,postid}) {
    const[likes,setLikes]=useState(0);
    const[islike,setislike]=useState(false)
    const token=localStorage.getItem("token")
   var id=localStorage.getItem("id")
    useEffect(()=>{
      setLikes(like)
     const isitis=localStorage.getItem(`likes/${id}/${postid}`)
     if(isitis!==null){
      setislike(true);
     }else{
      setislike(false)
     }
    },[like,id,postid])
    async function handleclick(){
      if(islike){
        await axios.post(`http://localhost:3001/remove-like/${postid}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          setLikes(likes - 1);
          setislike(false);
          localStorage.removeItem(`likes/${id}/${postid}`);
        });
      }else{
        await  axios.post(`http://localhost:3001/add-like/${postid}`,{likes},{
          headers:{
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        }).then(res=>{
          if(islike){
            setLikes(likes-1);
            setislike(false)
        }else{
          setLikes(likes+1);
            setislike(true)
            id=res.data.id
            localStorage.setItem("id",id)
            localStorage.setItem(`likes/${id}/${postid}`,res.data.valid.toString())
        }
        })

      }
      
   
    }
  return (
    <div>
      <button onClick={handleclick} style={{borderRadius:'20px', backgroundColor:'white' ,border:'none'}}>{islike?'❤️ Liked' : '🤍 Like'}</button>
      <span>{likes}{likes===0?'like':'likes'}</span>
    </div>
  )
}
export default Like
