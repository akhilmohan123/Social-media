import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import "./ChatBox.css"; // Using the same CSS
import { useNavigate } from "react-router-dom";
import socket from "../../Socket/Socket";
function Chatbox({ chat, setsendmessage, recievemessage, data }) {
  const [userdata, setUserdata] = useState(null);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [online, setOnline] = useState(false);
  const scroll = useRef();
  let navigate = useNavigate();
  let recieverId = data.recieverId;
  let user = localStorage.getItem("userId");
  const handleSend = async (e) => {
    e.preventDefault();
    const messages = {
      senderId: user,
      text: newMessage,
      chatId: chat._id,
      recieverId: recieverId,
    };
    socket.emit("send-message", messages);

    try {
      const res = await axios.post("http://localhost:3001/message", messages);
      setMessage((prev) => [...prev, res.data]);
      setNewMessage("");
      const receiveId = chat.members.find((id) => id !== user);
      setsendmessage({ ...messages, receiveId });
    } catch (error) {
      console.error(error);
    }
  };

  function handleBack() {
    navigate(-1);
  }
  //  window.addEventListener("load", () => {

  // });

  useEffect(() => {
    const id = chat?.members?.find((id) => id !== user);
    async function userDetails() {
      try {
        const result = await axios.get(
          `http://localhost:3001/get-friend/${id}`
        );
        setUserdata(result.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (chat) userDetails();
  }, [chat, user]);

  useEffect(() => {
    // 1. Fetch old messages from DB
    async function getMessages() {
      try {
        const result = await axios.get(
          `http://localhost:3001/message/${chat._id}`
        );
        setMessage(result.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (chat) getMessages();

    // 2. Listen for live socket messages
    socket.on("recieve-message", (newMessage) => {
      if (newMessage.chatId === chat._id) {
        // only add if it's for current chat
        setMessage((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Cleanup
    return () => {
      socket.off("recieve-message");
    };
  }, [chat]);

  useEffect(() => {
    if (recievemessage && recievemessage.chatId === chat._id) {
      setMessage((prev) => [...prev, recievemessage]);
    }
  }, [recievemessage]);

  useEffect(() => {
    // socket.connect()
    // socket.emit("new-user-add",user)
    socket.emit("user-online", data);
    socket.on("user-online-status", (status) => {
      if (status) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    });
    console.log("reciever id is ======" + recieverId);
  }, [recieverId]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
    console.log("online status is ====" + online);
  }, [message]);

  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.image || !imageData.contentType) return "";
    return `data:${imageData.contentType};base64,${imageData.image}`;
  };

  return (
    <div className="group-chat-container">
      {/* Header */}
      <div className="chat-header fixed-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <FiArrowLeft size={20} />
          </button>
          <div className="group-info">
            <h5>
              {userdata ? userdata.Fname : ""} {userdata ? userdata.Lname : ""}
            </h5>
            {online ? (
              <div className="group-status">
                <span>Online</span>
              </div>
            ) : (
              <span></span>
            )}
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        <div className="messages-view">
          {message.map((msg, index) => (
            <div
              key={index}
              className={`message-container ${
                msg.senderId === user ? "sent" : "received"
              }`}
            >
              {msg.senderId !== user && (
                <div className="message-sender">
                  {userdata?.Fname} {userdata?.Lname}
                </div>
              )}
              <div className="message-bubble">
                <div className="message-text">
                  <span className="message-content">{msg.text}</span>
                </div>
                <div className="message-meta">
                  <span className="message-time">{format(msg.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={scroll} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <form className="chat-input-form" onSubmit={handleSend}>
          <InputEmoji
            value={newMessage}
            onChange={setNewMessage}
            placeholder="Type a message..."
            cleanOnEnter
            borderRadius={24}
          />
          <button type="submit" className="send-button">
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbox;
