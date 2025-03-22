import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001";

const ChatPopup = ({ productName, sellerName, isOpen, togglePopup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch chat messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      console.log(`Fetching messages for ${productName} and ${sellerName}`);
      const response = await axios.get(`${API_URL}/api/v1/chat/${productName}/${sellerName}`);
      console.log("Fetched messages:", response.data);

      if (response.data) {
        setMessages(response.data);
      } else {
        console.error("No messages found.");
        alert("No messages found. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (error.response) {
        // Log the response status and data
        console.error("Error response:", error.response);
        alert(`Error fetching messages: ${error.response.data.message || 'Please try again.'}`);
      } else {
        // Log if no response from backend
        alert("Error fetching messages. Please check your internet connection or try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [productName, sellerName, isOpen]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      console.log("Sending message:", newMessage);
      const response = await axios.post(
        `${API_URL}/api/v1/chat/send`,
        { productName, sellerName, text: newMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Message sent successfully:", response);
      if (response.status === 200) {
        setNewMessage("");
        fetchMessages(); // Refresh chat after sending message
      }
    } catch (error) {
      console.error("Error sending message", error);
      if (error.response) {
        console.error("Server responded with:", error.response);
        alert(`Error: ${error.response.data.message || 'Something went wrong. Please try again.'}`);
      } else {
        alert("Error sending message. Please try again.");
      }
    }
  };

  return isOpen ? (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="chat-header">
          <h2>Chat with {sellerName}</h2>
          <button className="close-btn" onClick={togglePopup}>X</button>
        </div>
        <div className="chat-box">
          {loading ? (
            <p>Loading...</p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={message.sender === "User" ? "user-message" : "seller-message"}>
                <p><strong>{message.sender}:</strong> {message.text}</p>
              </div>
            ))
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ChatPopup;
