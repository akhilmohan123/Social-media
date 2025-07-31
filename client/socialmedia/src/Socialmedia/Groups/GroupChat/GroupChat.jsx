import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Badge } from 'react-bootstrap';
import './GroupChat.css'; // Keep or update with modern styles
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../Socket/Socket'
import { updateSetstatus, updateShowCreategroup, updateShowOwngroup, updateGroupchatStatus } from '../../../Redux/SocialCompent';
import { _get, apiClient } from '../../axios/Axios';


function GroupChat() {
  const dispatch = useDispatch();
  const [view, setView] = useState("chat"); // chat or members
  const userId=localStorage.getItem("userId")
  const token=localStorage.getItem("token")
  const username=useSelector((state)=>state.User.userName)
  const group=useSelector((state)=>state.Social.group)
  const [membersStatus,setmembersStatus]=useState(true)
  const [messages, setMessages] = useState([
  ]);
  const [members,setMembers]=useState([])
  //api to get the username

  useEffect(()=>{
    console.log(group)
    fetchMessage()
    console.log(messages)
    console.log(view)
    console.log(members)
  },[])



  const messagesEndRef = useRef(null);

  const handleSend = (newMessage) => {
    const messageObj = {
      groupID:group._id,
      groupname:group.groupname,
      sender: userId,
      name: username,
      text: newMessage,
      timestamp: new Date(),
    };
    console.log(messageObj)
    setMessages(prev => [...prev, messageObj]);
    socket.emit("group-message-send",messageObj)

  };

  const handleBack = () => {
    dispatch(updateSetstatus(false));
    dispatch(updateShowCreategroup(false));
    dispatch(updateShowOwngroup(false));
    dispatch(updateGroupchatStatus(false));
  };

  const fetchMessage =async ()=>{
    try {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        let response=await _get(`/api/social-media/fetch-message/${group._id}`)
        console.log(response.data)
        setMessages(prev=>[...prev,...response.data])
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if(view=='chat')
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //for listening socket event
useEffect(() => {
  const handleMessage = (message) => {
    console.log("message is recived ");
    console.log(message);
    if(message.sender !=userId)
    {
       setMessages(prev => [...prev, message]);
    }
    
  };

  socket.on("group-message-recieved", handleMessage);

  return () => {
    socket.off("group-message-recieved", handleMessage); // Clean up on unmount
  };
}, []); // ✅ Only run once on mount

const handleMembers = async ()=>{
  setView("members")
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  let result=await _get(`/api/socialmedia/fetch-members/${group._id}`)
  console.log(result.data)

  setMembers(result.data)
  console.log(members)
}


  return (
    <div className="group-chat-container d-flex flex-column" style={{ height: '100vh', background: '#f8f9fa' }}>
      
      {/* Header */}
      <div className="chat-header d-flex justify-content-between align-items-center px-4 py-2 bg-white shadow-sm"  style={{
    position: 'sticky',
    top: 0,
    zIndex: 1020, // higher than other elements
    backgroundColor: '#ffffff', // important for overlapping
  }}>
        <div>
          <h5 className="mb-0 text-primary">asdasd</h5>
          <small className="text-muted">20 members</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button variant="outline-info" size="sm" onClick={handleMembers}>
            👥 Members
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={handleBack}>
            ← Back
          </Button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="chat-body flex-grow-1 px-4 py-3 overflow-auto">
        
        {view === "members" ? (
  <div className="px-3">
    <h6 className="mb-3">Group Members</h6>
    {members.length > 0 ? (
      <ul className="list-unstyled">
        {members.map((name, idx) => (
          <li key={idx} className="d-flex align-items-center mb-2">
            <span className="me-2">👤</span>
            <span>{name}</span>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-muted">No members found.</div>
    )}
  </div>
) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex flex-column ${msg.sender === userId ? 'align-items-end' : 'align-items-start'} mb-3`}

            >
              <div
                className={`message-bubble p-2 rounded 
                  ${msg.sender === userId ? 'bg-primary text-white' : 'bg-light text-dark'}

                }`}
                style={{ maxWidth: '75%' }}
              >
                <div className="fw-bold">{msg.name}</div>
                <div>{msg.text}</div>
                <div className="text-end small text-muted mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      {view === "chat" && (
        <Form
          className="chat-input d-flex p-3 border-top bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            const text = e.target.message.value.trim();
            if (text) {
              handleSend(text);
              e.target.reset();
            }
          }}
        >
          <Form.Control
            type="text"
            name="message"
            placeholder="Type a message..."
            className="me-2 rounded-pill shadow-sm"
          />
          <Button variant="primary" type="submit" className="px-4 rounded-pill shadow-sm">
            Send
          </Button>
        </Form>
      )}
    </div>
  );
}

export default GroupChat;
