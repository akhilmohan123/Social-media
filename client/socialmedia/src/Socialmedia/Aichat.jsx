import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { Button } from "react-bootstrap";
import "./Aichat.css";
function AiChat() {
  const [userdata, setUserdata] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

  // Fetch user data when component mounts

  // Fetch messages when component mounts or updates

  // Function to handle sending messages
  async function handleSend(e) {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    // Append user message to chat
    const userMessage = {
      text: newMessage,
      type: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    // Clear the input field
    setNewMessage("");

    try {
      // Send the user message to the Hugging Face API
      const response = await axios.post("http://localhost:3001/ai/converse", {
        message: newMessage,
      });
      console.log(response);
      // Append AI response to chat
      const aiMessage = {
        text: response.data,
        type: "ai",
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  return (
    <div className="ChatBox-container">
      <div className="chat-header">
        <div className="follower col-md-3">
          <div>
            <div className="image-div">
             <img className="imagecomp" src="/images/ai.jpg" alt="AI"/>
            </div>
            <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="textcolor">Ask me anything</h1>
        </div>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.type === "ai" ? "ai-message" : "user-message"
            }`}
          >
            <div className="message-content">{msg.text}</div>
            <div className="message-time">{format(msg.timestamp)}</div>
          </div>
        ))}
        <div ref={scroll} /> {/* To scroll to the latest message */}
      </div>
      <div className="chat-sender">
        <InputEmoji value={newMessage} onChange={handleChange} className="input-emoji"/>
        <Button onClick={handleSend} className="send-button">Send</Button>
      </div>
    </div>
  );
}

export default AiChat;
