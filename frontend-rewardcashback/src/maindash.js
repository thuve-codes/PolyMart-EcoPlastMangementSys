import React from 'react';
import './App.css';
import logo from './assets/images/polymart-logo.png';


function Dashboard() {
  return (
    <div className="dashboard">
      

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Polymart Logo" className="logo" />
        </div>
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/redeem">Redeem</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
          <li><a href="#">Notifications</a></li>
        </ul>
      </nav>

      {/* Page Heading */}
      <div className="heading-container">
        <h1>Polymart Rewards & Cashback</h1>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        <div className="user-info">
          <h3>Welcome, [User]</h3>
          <p>Your Current Points: <span className="points">120</span></p>
          <button className="redeem-btn">Redeem Rewards</button>
        </div>

        {/* Recent Transactions */}
        <div className="transactions">
          <h3>Recent Transactions</h3>
          <ul>
            <li>+10 Points - Plastic Bottle Submission (Mar 19, 2025)</li>
            <li>-50 Points - Store Discount (Mar 15, 2025)</li>
            <li>+30 Points - Plastic Waste Collection Event (Mar 10, 2025)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;