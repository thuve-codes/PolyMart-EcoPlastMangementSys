import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';
import logo from './assets/images/polymart-logo.png';

function Dashboard() {
  const navigate = useNavigate(); // Initialize navigation
  const [points, setPoints] = useState(120);

  const transactions = [
    { id: 1, type: "earn", details: "+10 Points - Plastic Bottle Submission", date: "Mar 19, 2025" },
    { id: 2, type: "redeem", details: "-50 Points - Store Discount", date: "Mar 15, 2025" },
    { id: 3, type: "earn", details: "+30 Points - Plastic Waste Collection Event", date: "Mar 10, 2025" }
  ];

  const leaderboard = [
    { id: 1, name: "John Doe", points: 320 },
    { id: 2, name: "Jane Smith", points: 290 },
    { id: 3, name: "Alex Brown", points: 270 },
  ];

  return (
    <div className="dashboard">
      
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Polymart Logo" className="logo" />
        </div>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/redeem">Redeem</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
          <li><a href="/notifications">Notifications</a></li>
        </ul>
      </nav>

      {/* Page Heading */}
      <div className="heading-container">
        <h1>Polymart Rewards & Cashback</h1>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        
        {/* User Profile */}
        <div className="user-profile">
          <h3>👋 Welcome, Alex!</h3>
          <p>Membership Level: <span className="membership">Gold</span></p>
          <p>Your Current Points: <span className="points">{points}</span></p>

          {/* Progress Bar for Next Reward */}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(points / 200) * 100}%` }}></div>
          </div>
          <p>🔥 Earn <b>{200 - points}</b> more points for the next reward!</p>

          {/* Redeem Button */}
          <button className="redeem-btn" onClick={() => navigate('/redeem')}>
            Redeem Rewards
          </button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="actions">
            <button className="action-btn">♻️ Submit Plastic Waste</button>
            <button className="action-btn">📢 Join an Event</button>
            <button className="action-btn">🔎 View Offers</button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions">
          <h3>📜 Recent Transactions</h3>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id} className={transaction.type === "earn" ? "earn" : "redeem"}>
                {transaction.details} ({transaction.date})
              </li>
            ))}
          </ul>
        </div>

        {/* Leaderboard Preview */}
        <div className="leaderboard-preview">
          <h3>🏆 Leaderboard (Top 3)</h3>
          <ul>
            {leaderboard.map((user) => (
              <li key={user.id}>
                {user.name} - <b>{user.points} Points</b>
              </li>
            ))}
          </ul>
          <a href="/leaderboard" className="view-more">View Full Leaderboard →</a>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
