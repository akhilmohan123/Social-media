import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "./ChatBox.css";
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';
import { Button } from 'react-bootstrap';

function Chatbox({ chat, user, setsendmessage, recievemessage }) {
    const [userdata, setUserdata] = useState(null);
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scroll = useRef();

    function handleSend(e) {
        e.preventDefault();
        const messages = {
            senderId: user,
            text: newMessage,
            chatId: chat._id
        };
        try {
            axios.post("http://localhost:3001/message", messages).then(res => {
                setMessage([...message, res.data]);
                setNewMessage("");
                console.log(res)
            });
        } catch (error) {
            console.error(error);
        }
        const receiveId = chat.members.find(id => id !== user);
        setsendmessage({ ...messages, receiveId });
    }

    useEffect(() => {
        const id = chat?.members?.find(id => id !== user);
        async function userDetails() {
            try {
                const result = await axios.get(`http://localhost:3001/get-friend/${id}`);
                setUserdata(result.data);
            } catch (error) {
                console.error(error);
            }
        }
        if (chat) userDetails();
    }, [chat, user]);

    useEffect(() => {
        async function getMessages() {
            try {
                const result = await axios.get(`http://localhost:3001/message/${chat._id}`);
                setMessage(result.data);
            } catch (error) {
                console.error(error);
            }
        }
        if (chat) getMessages();
    }, [chat]);

    useEffect(() => {
        if (recievemessage && recievemessage.chatId === chat._id) {
            setMessage([...message, recievemessage]);
        }
    }, [recievemessage]);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const getImageSrc = (imageData) => {
        if (!imageData || !imageData.image || !imageData.contentType) return '';
        return `data:${imageData.contentType};base64,${imageData.image}`;
    };

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
     
    };
  

    return (
        <div className='ChatBox-container'>
            <div className='chat-header'>
                <div className='follower'>
                    <div>
                        <img src={userdata ? getImageSrc(userdata.Image) : ''} alt='user' className='followerImage' />
                        <div className='name' style={{ fontSize: "0.8rem" }}>
                            <span style={{color:'blueviolet'}}>{userdata ? userdata.Fname : ''} {userdata ? userdata.Lname : ''}</span>
                        </div>
                        <hr style={{ width: '85%', border: '0.1px solid #ececec' }} />
                    </div>
                </div>
            </div>
            <div className='chat-body'>
                {message.map((msg, index) => (
                    <div key={index} className={msg.senderId === user ? "message own" : "message"}>
                        <span>{msg.text}</span>
                        <span>{format(msg.createdAt)}</span>
                    </div>
                ))}
                <div ref={scroll} /> {/* To scroll to the latest message */}
            </div>
            <div className='chat-sender'>
                <InputEmoji
                    value={newMessage}
                    onChange={handleChange}
                />
                <Button onClick={handleSend}>Send</Button>
            </div>
        </div>
    );
}

export default Chatbox;
