import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ChatPopup = ({ productName, sellerName, isOpen, togglePopup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const storedUsername = localStorage.getItem("username");

  // Use useCallback to memoize fetchMessages to prevent unnecessary re-creations
  const fetchMessages = useCallback(async () => {
    if (!storedUsername) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/chat/${productName}/${sellerName}?username=${storedUsername}`
      );
      if (response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [productName, sellerName, storedUsername]); // Add dependencies here

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, fetchMessages]); // Add fetchMessages as a dependency

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !storedUsername) return;

    setSending(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/chat/send`,
        {
          productName,
          sellerName,
          text: newMessage,
          sender: storedUsername,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setNewMessage("");
        await fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="chat-header">
          <h2>Chat about {productName}</h2>
          <button className="close-button" onClick={togglePopup}>✕</button>
        </div>

        <div className="chat-box">
          {loading ? (
            <div className="loading-indicator">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="loading-indicator">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message-bubble ${message.sender === storedUsername ? "user" : "seller"}`}
              >
                <span className={`sender-name ${message.sender === storedUsername ? "user" : "seller"}`}>
                  {message.sender === storedUsername ? "You" : message.sender}
                </span>
                {message.text}
              </div>
            ))
          )}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={sending}
          />
          <button
            className="send-button"
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
