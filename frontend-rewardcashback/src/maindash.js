import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import logo from './assets/images/polymart-logo.png';

// Configure axios base URL (optional, recommended for cleaner code)
axios.defaults.baseURL = 'http://localhost:5000'; // Adjust for production

function Dashboard() {
  const navigate = useNavigate();
  const [points] = useState(120);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI assistant. Ask me anything about recycling, rewards, or how to earn more points!" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatEndRef = useRef(null);

  const transactions = [
    { id: 1, type: 'earn', details: '+10 Points - Plastic Bottle Submission', date: 'Mar 19, 2025' },
    { id: 2, type: 'redeem', details: '-50 Points - Store Discount', date: 'Mar 15, 2025' },
    { id: 3, type: 'earn', details: '+30 Points - Plastic Waste Collection Event', date: 'Mar 10, 2025' },
  ];

  const leaderboard = [
    { id: 1, name: 'John Doe', points: 320 },
    { id: 2, name: 'Jane Smith', points: 290 },
    { id: 3, name: 'Alex Brown', points: 270 },
  ];

  const handleSend = async () => {
    if (!chatInput.trim()) return; // Prevent sending empty messages

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chatbot', {
        messages: [userMessage], // Only send the latest message
      });

      const aiResponse = response.data?.choices?.[0]?.message;
      if (aiResponse) {
        setChatMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I couldn\'t get a response. Try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChatbot && !event.target.closest('.chatbot-popup, .chatbot-button')) {
        setShowChatbot(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChatbot]);

  return (
    <div className="dashboard">
\

      <div className="heading-container">
        <h1>Polymart Rewards & Cashback</h1>
      </div>

      <div className="dashboard-container">
        <div className="user-profile">
          <h3>👋 Welcome, Alex!</h3>
          <p>
            Membership Level: <span className="membership">Gold</span>
          </p>
          <p>
            Your Current Points: <span className="points">{points}</span>
          </p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(points / 200) * 100}%` }} />
          </div>
          <p>
            🔥 Earn <b>{200 - points}</b> more points for the next reward!
          </p>
          <button className="redeem-btn" onClick={() => navigate('/redeem')}>
            Redeem Rewards
          </button>
        </div>

        <div className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="actions">
            <button className="action-btn">♻️ Submit Plastic Waste</button>
            <button className="action-btn">📢 Join an Event</button>
            <button className="action-btn">🔎 View Offers</button>
          </div>
        </div>

        <div className="transactions">
          <h3>📜 Recent Transactions</h3>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id} className={transaction.type}>
                {transaction.details} ({transaction.date})
              </li>
            ))}
          </ul>
        </div>

        <div className="leaderboard-preview">
          <h3>🏆 Leaderboard (Top 3)</h3>
          <ul>
            {leaderboard.map((user) => (
              <li key={user.id}>
                {user.name} - <b>{user.points} Points</b>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate('/leaderboard')} >
            View Full Leaderboard →
          </button>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <button 
        className="chatbot-button"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        {showChatbot ? '✕' : '🤖'}
      </button>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <h3>Polymart AI Assistant</h3>
            <button 
              className="close-chatbot" 
              onClick={() => setShowChatbot(false)}
            >
              ✕
            </button>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <span className="message-content">{msg.content}</span>
              </div>
            ))}
            {isLoading && <div className="typing-indicator">AI is typing...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask about recycling, rewards..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="send-button"
              disabled={isLoading}
            >
              {isLoading ? '✉️...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;