import React, { useEffect, useRef, useState } from 'react'
import './Chat.css'
import axios from 'axios';
import Conversation from './Conversation/Conversation';
import Chatbox from './Chatbox/Chatbox';
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom';
function Chat() {
  const[chats,setchats]=useState([])
  const[user,setUser]=useState();
  const[currentchat,setcurrentchat]=useState(null)
  const[onlineusers,setonlineusers]=useState([])
  const[sendmessage,setsendmessage]=useState("")
  const[recievemessage,Setrecievemessage]=useState(null)
  const socket=useRef()
  const token=localStorage.getItem("token")
  console.log(chats)
  const match=useParams('/chat-friend/:id')
  const data={senderId:user,recieverId:match.id}
useEffect(()=>{
  function callfriend(){

    try {
      axios.post("http://localhost:3001/chat",data)
    } catch (error) {
      
    }
  }
  callfriend()
},[user,match.id])
  useEffect(()=>{
    socket.current=io('http://localhost:8800');
    socket.current.emit("new-user-add",user)
    socket.current.on('get-users',(users)=>{
    setonlineusers(users)
    })
    
  },[user])
  useEffect(()=>{
    if(sendmessage!=null){
      socket.current.emit('send-message',sendmessage)
    }
  },[sendmessage])
  useEffect(()=>{
    socket.current.on("recieve-message",(data)=>{
      Setrecievemessage(data)
    })
  },[])
  
  console.log(onlineusers)
  useEffect(()=>{
    const getChats=async ()=>{
      try {
        const result=await axios.get(`http://localhost:3001/chat/${match.id}`,{
           headers:{
            Authorization:`Bearer ${token}`
           }
        }).then(result=>{
          console.log(result.data.chat)
          setchats(result.data.chat)
          setcurrentchat(result.data.chat[0])
          setUser(result.data.userid)
        })
      } catch (error) {
        
      }
    }
    getChats()
  },[token])
  console.log(currentchat+"dc")
  return (
  
      <div className='Chat-container'>
      <div className='Right-side-chat'>
        <Chatbox chat={currentchat} user={user} setsendmessage={setsendmessage} recievemessage={recievemessage}/>
      </div>
      </div>
      
      

  )
}

export default Chat
