import React, { useEffect, useRef, useState } from 'react'
import './Chat.css'
import axios from 'axios';
import Conversation from './Conversation/Conversation';
import Chatbox from './Chatbox/Chatbox';
import { useParams } from 'react-router-dom';
import socket from '../Socket/Socket';
import { _get } from '../axios/Axios';
function Chat() {
  const[chats,setchats]=useState([])
  const[user,setUser]=useState();
  const[currentchat,setcurrentchat]=useState(null)
  const[onlineusers,setonlineusers]=useState([])
  const[sendmessage,setsendmessage]=useState("")
  const[recievemessage,Setrecievemessage]=useState(null)
  const userdata=localStorage.getItem("userId")
  const match=useParams('/chat-friend/:id')
  let recieverId=match.id
  const data={senderId:userdata,recieverId:recieverId}



useEffect(()=>{
  function callfriend(){
    try {
      axios.post("http://localhost:3001/chat",data)
    } catch (error) {
      console.log(error)
    }
  }
  callfriend()
},[user,match.id])

  //  window.addEventListener("load", () => {
  //     socket.connect()
  //     socket.emit("new-user-add",user)
  //   });
  // useEffect(()=>{
  //   if(!user) return

  //   socket.connect()
  //   socket.emit("new-user-add",user)
  //   socket.on('get-users',(users)=>{
  //     console.log("new users added ")
  //     console.log(users)
  //   setonlineusers(users)
  //   })
    
  // },[user])
  // useEffect(()=>{
  //   if(sendmessage!=null){
  //     socket.emit('send-message',sendmessage)
  //   }
  // },[sendmessage])
  /*useEffect(()=>{
    socket.on("recieve-message",(data)=>{
      Setrecievemessage(data)
    })
    console.log("user data is ============================="+userdata)
  },[])
  */
//  useEffect(()=>{
//   if(recieverId)
//   {
//     console.log("emiiting the user id "+recieverId)
//     socket.emit("user-online",recieverId)
//   }
//  },[recieverId])
  useEffect(()=>{
    const getChats=async ()=>{
      try {
        const result=await _get(`http://localhost:3001/chat/${match.id}`,{
        }).then(result=>{
          console.log(result.data.chat)
          setchats(result.data.chat)
          setcurrentchat(result.data.chat[0])
          setUser(result.data.userid)
        })
      } catch (error) {
        console.log(error)
      }
    }
    getChats()
  },[])
  console.log(currentchat+"dc")
  return (
  
      <div className='Chat-container'>
           <div className='Right-side-chat'>
              <Chatbox chat={currentchat}  setsendmessage={setsendmessage} recievemessage={recievemessage} data={data}/>
           </div>
      </div>
      
      

  )
}

export default Chat
