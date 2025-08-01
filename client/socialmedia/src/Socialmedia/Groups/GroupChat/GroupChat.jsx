import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Badge, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../Socket/Socket";
import {
  updateSetstatus,
  updateShowCreategroup,
  updateShowOwngroup,
  updateGroupchatStatus,
} from "../../../Redux/SocialCompent";
import { _get, apiClient } from "../../axios/Axios";
import { FiArrowLeft, FiUsers, FiSend, FiClock } from "react-icons/fi";
import { BsThreeDotsVertical, BsCheck2All } from "react-icons/bs";
import "./GroupChat.css"; // You'll need to update this CSS file

function GroupChat() {
  const dispatch = useDispatch();
  const [view, setView] = useState("chat");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMember, setTypingMember] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const username = useSelector((state) => state.User.userName);
  const group = useSelector((state) => state.Social.group);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const messagesEndRef = useRef(null);

  // Format time for messages
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for message grouping
  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await fetchMessage();
      setLoading(false);
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    console.log(messages)
    console.log("username is "+username)
  }, [messages, view]);

  const handleSend = (newMessage) => {
    const messageObj = {
      groupID: group._id,
      groupname: group.groupname,
      sender: userId,
      name: username,
      text: newMessage,
      timestamp: new Date(),
      username:username
    };
    
    setMessages((prev) => [...prev, messageObj]);
    socket.emit("group-message-send", messageObj);
  };

  const handleBack = () => {
    dispatch(updateSetstatus(false));
    dispatch(updateShowCreategroup(false));
    dispatch(updateShowOwngroup(false));
    dispatch(updateGroupchatStatus(false));
  };

  const fetchMessage = async () => {
    try {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      let response = await _get(`/api/social-media/fetch-message/${group._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleMembers = async () => {
    setView(view === "members" ? "chat" : "members");
    
    if (members.length === 0) {
      try {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        let result = await _get(`/api/socialmedia/fetch-members/${group._id}`);
        setMembers(result.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = formatDate(message.timestamp);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  return (
    <div className="group-chat-container">
      {/* Header */}
      <div className="chat-header fixed-header">
        <div className="header-left">
          <Button variant="link" onClick={handleBack} className="back-button">
            <FiArrowLeft size={20} />
          </Button>
          <div className="group-info">
            <h5>{group?.groupname || "Group Chat"}</h5>
            <div className="group-status">
              {isTyping ? (
                <span className="typing-indicator">{typingMember} is typing...</span>
              ) : (
                <span>{members.length} members</span>
              )}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{view === "members" ? "Show Chat" : "Show Members"}</Tooltip>}
          >
            <Button variant="link" onClick={handleMembers} className="members-button">
              <FiUsers size={20} />
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        {loading ? (
          <div className="loading-container">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : view === "members" ? (
          <div className="members-view">
            <div className="members-header">
              <h6>Group Members</h6>
              <span className="badge">{members.length}</span>
            </div>
            <div className="members-list">
              {members.length > 0 ? (
                members.map((member, idx) => (
                  <div key={idx} className="member-item">
                    <div className="member-avatar">
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member}</span>
                      <span className="member-status">Online</span>
                    </div>
                    <Button variant="link" className="member-options">
                      <BsThreeDotsVertical />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="no-members">No members found</div>
              )}
            </div>
          </div>
        ) : (
          <div className="messages-view">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <React.Fragment key={date}>
                <div className="date-divider">
                  <span>{date}</span>
                </div>
                {dateMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message-container ${
                      msg.sender === userId ? "sent" : "received"
                    }`}
                  >
                    {msg.sender !== userId && (
                      <div className="message-sender">{msg.name}</div>
                    )}
                    <div className="message-bubble">
                    <div className="message-text">
                        <span className="message-username">{msg.username}</span>
                        <span className="message-content">{msg.text}</span>
                      </div>
                      <div className="message-meta">
                        <span className="message-time">
                          <FiClock size={12} /> {formatTime(msg.timestamp)}
                        </span>
                        {msg.sender === userId && (
                          <span className="message-status">
                            <BsCheck2All size={14} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      {view === "chat" && (
        <div className="chat-input-container">
          <Form
            className="chat-input-form"
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
              as="textarea"
              name="message"
              placeholder="Type a message..."
              rows={1}
              className="message-input"
              onFocus={() => socket.emit("typing-start", { userId, groupId: group._id })}
              onBlur={() => socket.emit("typing-stop", { userId, groupId: group._id })}
            />
            <Button type="submit" className="send-button">
              <FiSend size={18} />
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default GroupChat;