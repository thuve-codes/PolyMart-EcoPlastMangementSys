import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import polymartLogo from "./images/polymart-logo.png";
import { FaShoppingCart } from "react-icons/fa";  // Importing a cart icon

import '../App.css';

export default function Header({ cartItems }) {
  const location = useLocation();  // Get the current route

  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Try to read from localStorage first
    let storedUsername = localStorage.getItem('username');
  
    // If localStorage doesn't have it, try URL params (just after login)
    if (!storedUsername) {
      const params = new URLSearchParams(window.location.search);
      const userFromURL = params.get('username');
      const profileFromURL = params.get('profile');
  
      if (userFromURL) {
        localStorage.setItem('username', userFromURL);
        if (profileFromURL) localStorage.setItem('profile', profileFromURL);
        storedUsername = userFromURL;
  
        // Clean up URL by removing query params
        const url = new URL(window.location);
        url.search = "";
        window.history.replaceState({}, document.title, url);
      }
    }
  
    console.log("Username from localStorage:", storedUsername);
    setUsername(storedUsername);
  }, []);
  

  // Check if the user is logged in
  const isLoggedIn = !!username; // Check if a username exists in localStorage

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('username'); // Remove username from localStorage
    setUsername(null); // Update state
    window.location.href = "http://localhost:3000"; // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar" id="navbar">
      <div className="container-fluid">
        {/* Brand Logo */}
        <div className="navbar-brand navname" href="#">
          <Link to="/" className="nav-brand-link">
            <img
              src={polymartLogo}
              alt="Polymart Logo"
              className="logo"
              style={{ maxHeight: '50px', objectFit: 'contain' }}
            />{" "}
            <span className="brand-text">Poly EStore</span>
          </Link>
        </div>

        {/* Navbar Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="col-12 col-md-6 mt-2 mt-md-0"></div>

          {/* Navbar Menu (Right Aligned) */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="navbar">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link navname ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                to="/orders" 
                className={`nav-link navname ${location.pathname === '/orders' ? 'active' : ''}`}
              >
                My Orders
              </Link>
            </li>

            <li className="nav-item dropdown">
              <Link 
                className={`nav-link navname ${location.pathname === 'http://localhost:3002/Home' ? 'active' : ''}`} 
                to="http://localhost:3002/Home" 
                id="ecoUserDropdown" 
                role="button" 
                aria-expanded="false"
              >
                EcoUser
              </Link>
              <ul className="dropdown-menu" aria-labelledby="ecoUserDropdown">
                <li>
                  <Link to="http://localhost:3002/PickupForm" className="dropdown-item">Pickup Request</Link>
                </li>
                <li>
                  <Link to="http://localhost:3002/RecyclingTrackingPage" className="dropdown-item">Pickup Status</Link>
                </li>
                <li>
                  <Link to="http://localhost:3002/RecyclerDashboard" className="dropdown-item">Recycler Dashboard</Link>
                </li>
                <li>
                  <Link to="http://localhost:3002/PickupStatusPage" className="dropdown-item">Notifications</Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
            <Link
              className="nav-link navname"
              to={username ? `http://localhost:3004/?username=${username}` : "http://localhost:3004"}
              id="rewardDropdown"
              role="button"
              aria-expanded="false"
            >
              Reward & CashBack
            </Link>

            <ul className="dropdown-menu" aria-labelledby="rewardDropdown">
              <li>
                <a href={`http://localhost:3004/Calculator?username=${username}`} className="dropdown-item">Calculator</a>
              </li>
              <li>
                <a href={`http://localhost:3004/leaderboard?username=${username}`} className="dropdown-item">Leaderboard</a>
              </li>
              <li>
                <a href={`http://localhost:3004/Claim?username=${username}`} className="dropdown-item">Claim Redeem</a>
              </li>
              <li>
                <a href={`http://localhost:3004/Ecolocation?username=${username}`} className="dropdown-item">Eco Locations</a>
              </li>
            </ul>

            </li>


            <li className="nav-item">
              <Link 
                to="/aboutus"  
                className={`nav-link navname ${location.pathname === '/aboutus' ? 'active' : ''}`}
              >About Us</Link>
            </li>
          </ul>
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-left d-flex justify-content-end align-items-center">
          {isLoggedIn ? (
            <>
              <div className="d-flex align-items-center" style={{ padding: '8px' }}>
                <div
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: '30px', height: '30px', marginRight: '8px' }}
                >
                  {username.charAt(0).toUpperCase()} {/* Or an actual image */}
                </div>
                <span className="navname me-2 pa" style={{ marginRight: '8px', padding: '4px' }} 
                  onClick={() => {
                    window.location.href = "http://localhost:3001/profile"; // Redirect to profile page
                  }}>{username}</span>
                <button
                  className="btn btn-outline-danger navname p-2"
                  id="logout_btn"
                  onClick={handleLogout}
                  style={{ padding: '8px' }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              className="btn navname"
              id="login_btn"
              onClick={() => {
                window.location.href = "http://localhost:3001";
              }}
            >
              Login
            </button>
          )}
          <Link to="/cart">
            <span id="cart" className="ml-3 navname">
              <FaShoppingCart size={20} /> {/* Cart Icon */}
            </span>
            <span className="ml-1 navname" id="cart_count">{cartItems.length}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
