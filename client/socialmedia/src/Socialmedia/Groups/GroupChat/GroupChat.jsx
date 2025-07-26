import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Badge } from 'react-bootstrap';
import './GroupChat.css'; // Keep or update with modern styles
import { useDispatch } from 'react-redux';
import { updateSetstatus, updateShowCreategroup, updateShowOwngroup, updateGroupchatStatus } from '../../../Redux/SocialCompent';

function GroupChat({ groupName = "Nature Lovers", membersCount = 12 }) {
  const dispatch = useDispatch();
  const [view, setView] = useState("chat"); // chat or members
  const [messages, setMessages] = useState([
    {
      sender: 'me',
      name: 'You',
      text: 'Hey everyone!',
      timestamp: new Date(),
    },
    {
      sender: 'Alice',
      name: 'Alice',
      text: 'Hi! Excited for the next hike?',
      timestamp: new Date(),
    },
    {
      sender: 'me',
      name: 'You',
      text: 'Absolutely! Let’s plan soon.',
      timestamp: new Date(),
    },
    {
      sender: 'Bob',
      name: 'Bob',
      text: 'I found a new trail we can explore.',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);

  const handleSend = (newMessage) => {
    const messageObj = {
      sender: 'me',
      name: 'You',
      text: newMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, messageObj]);
  };

  const handleBack = () => {
    dispatch(updateSetstatus(false));
    dispatch(updateShowCreategroup(false));
    dispatch(updateShowOwngroup(false));
    dispatch(updateGroupchatStatus(false));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          <h5 className="mb-0 text-primary">{groupName}</h5>
          <small className="text-muted">{membersCount} members</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button variant="outline-info" size="sm" onClick={() => setView("members")}>
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
          <div className="text-muted text-center mt-5">Members list feature coming soon...</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex flex-column ${msg.sender === 'me' ? 'align-items-end' : 'align-items-start'} mb-3`}
            >
              <div
                className={`message-bubble p-2 rounded ${
                  msg.sender === 'me' ? 'bg-primary text-white' : 'bg-light text-dark'
                }`}
                style={{ maxWidth: '75%' }}
              >
                <div className="fw-bold">{msg.name}</div>
                <div>{msg.text}</div>
                <div className="text-end small text-muted mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
