import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const API_URL = "http://localhost:5001";

// Styled components for better UI
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  width: 400px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: #4a6fa5;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  &:hover {
    opacity: 0.8;
  }
`;

const ChatBox = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${props => props.isUser ? `
    background: #4a6fa5;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  ` : `
    background: white;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  `}
`;

const SenderName = styled.span`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 4px;
  display: block;
  color: ${props => props.isUser ? '#e0e0e0' : '#666'};
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #4a6fa5;
  }
`;

const SendButton = styled.button`
  background: #4a6fa5;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 0 20px;
  margin-left: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  &:hover {
    background: #3a5a8f;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
`;

const ChatPopup = ({ productName, sellerName, isOpen, togglePopup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

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
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [productName, sellerName, isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/chat/send`,
        { productName, sellerName, text: newMessage },
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
    <PopupOverlay>
      <PopupContainer>
        <ChatHeader>
          <h2>Chat about {productName}</h2>
          <CloseButton onClick={togglePopup}>✕</CloseButton>
        </ChatHeader>
        
        <ChatBox>
          {loading ? (
            <LoadingIndicator>Loading messages...</LoadingIndicator>
          ) : messages.length === 0 ? (
            <LoadingIndicator>No messages yet. Start the conversation!</LoadingIndicator>
          ) : (
            messages.map((message, index) => (
              <MessageBubble key={index} isUser={message.sender === "User"}>
                <SenderName isUser={message.sender === "User"}>
                  {message.sender === "User" ? "You" : sellerName}
                </SenderName>
                {message.text}
              </MessageBubble>
            ))
          )}
        </ChatBox>
        
        <ChatInputContainer>
          <MessageInput
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={sending}
          />
          <SendButton onClick={sendMessage} disabled={sending || !newMessage.trim()}>
            {sending ? "Sending..." : "Send"}
          </SendButton>
        </ChatInputContainer>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default ChatPopup;