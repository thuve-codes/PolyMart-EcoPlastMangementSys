import React, { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import logo from './Assests/images/polymart-logo.png';
import './Header.css';

export default function Header() {
  const [ecoDropdown, setEcoDropdown] = useState(false);
  const [rewardDropdown, setRewardDropdown] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const params = new URLSearchParams(window.location.search);
      const userFromURL = params.get('username');
      const profileFromURL = params.get('profile');

      if (userFromURL) {
        localStorage.setItem('username', userFromURL);
        if (profileFromURL) localStorage.setItem('profile', profileFromURL);
        setUsername(userFromURL);

        // Clean the URL
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, document.title, url);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('profile');
    setUsername(null);
    window.location.href = "http://localhost:3002/Home"; // Redirect to login
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" />
        <strong style={{ color: 'white', fontSize: '24px' }}> Polymart</strong>
      </div>

      <ul className="nav-links">
        <li><Link to="http://localhost:3000">Home</Link></li>
        <li><Link to="http://localhost:3000/orders">My Orders</Link></li>

        <li className="dropdown"
            onMouseEnter={() => setEcoDropdown(true)}
            onMouseLeave={() => setEcoDropdown(false)}>
          <span>EcoUser</span>
          {ecoDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="http://localhost:3002/PickupForm">Pickup Request</Link></li>
              <li><Link to="http://localhost:3002/RecyclingTrackingPage">Pickup Status</Link></li>
              <li><Link to="http://localhost:3002/RecyclerDashboard">Recycler Dashboard</Link></li>
              <li><Link to="http://localhost:3002/notifications">Notifications</Link></li>
            </ul>
          )}
        </li>

        <li className="dropdown"
            onMouseEnter={() => setRewardDropdown(true)}
            onMouseLeave={() => setRewardDropdown(false)}>
          <span>Reward & CashBack</span>
          {rewardDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="http://localhost:3004/calculator">Calculator</Link></li>
              <li><Link to="http://localhost:3004/leaderboard">Leaderboard</Link></li>
              <li><Link to="http://localhost:3004/claim">Claim Redeem</Link></li>
              <li><Link to="http://localhost:3004/ecolocation">Eco Locations</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="http://localhost:3000/aboutus">About Us</Link></li>
      </ul>

      {/* Right Nav */}
      <div className="navbar-right">
        {username ? (
          <div className="user-info">
            {localStorage.getItem('profile') ? (
              <img
                src={localStorage.getItem('profile')}
                alt="Profile"
                className="profile-pic"
              />
            ) : (
              <div className="profile-placeholder">
                {username.charAt(0).toUpperCase()}
              </div>
            )}

            <span
              className="username"
              onClick={() => window.location.href = "http://localhost:3001/profile"}
            >
              {username}
            </span>

            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => window.location.href = "http://localhost:3001"}
          >
            Login
          </button>
        )}

        <Link to="http://localhost:3000/cart" className="cart-icon">
          <FaShoppingCart size={20} />
        </Link>
      </div>
    </nav>
  );
}
