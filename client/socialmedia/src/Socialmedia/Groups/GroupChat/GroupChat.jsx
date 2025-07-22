import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import './GroupChat.css'; // Make sure to include custom styles

function GroupChat({ groupName = "Nature Lovers", membersCount = 12, onBack }) {
  const [messages, setMessages] = useState([
    { sender: 'me', text: 'Hey everyone!' },
    { sender: 'Alice', text: 'Hi! Excited for the next hike?' },
    { sender: 'me', text: 'Absolutely! Let’s plan soon.' },
    { sender: 'Bob', text: 'I found a new trail we can explore.' },
  ]);

  const messagesEndRef = useRef(null);

  const handleSend = (newMessage) => {
    setMessages(prev => [...prev, { sender: 'me', text: newMessage }]);
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="group-chat-container d-flex flex-column">
      {/* Header */}
      <div className="chat-header d-flex justify-content-between align-items-center px-4 py-2">
        <div className="group-title text-primary fw-bold">{groupName}</div>
        <div className="members-count text-muted">{membersCount} members</div>
        <Button variant="outline-secondary" size="sm" onClick={onBack}>← Back</Button>
      </div>

      {/* Chat body */}
      <div className="chat-body flex-grow-1 px-4 py-3 overflow-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`d-flex ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
          >
            <div className={`message-bubble ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
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
          placeholder="Type your message..."
          className="me-2 rounded-pill"
        />
        <Button variant="primary" type="submit" className="px-4 rounded-pill">Send</Button>
      </Form>
    </div>
  );
}

export default GroupChat;
