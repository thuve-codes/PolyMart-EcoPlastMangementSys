import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import logo from './Assests/images/polymart-logo.png';
import './Header.css';

export default function Header() {
  const [ecoDropdown, setEcoDropdown] = useState(false);
  const [rewardDropdown, setRewardDropdown] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    };

    const handleMessage = (event) => {
      if (
        !['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004'].includes(
          event.origin
        )
      ) {
        return;
      }
      if (event.data.type === 'LOGOUT') {
        localStorage.removeItem('username');
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
        setUsername(null);
      } else if (event.data.type === 'LOGIN') {
        localStorage.setItem('username', event.data.username);
        localStorage.setItem('profile', event.data.profile || '');
        setUsername(event.data.username);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const broadcastLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    window.postMessage({ type: 'LOGOUT' }, 'http://localhost:3000');
    window.postMessage({ type: 'LOGOUT' }, 'http://localhost:3001');
    window.postMessage({ type: 'LOGOUT' }, 'http://localhost:3004');
  };

  const handleLogout = () => {
    try {
      broadcastLogout();
      window.location.href = 'http://localhost:3000';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" />
        <strong style={{ color: 'white', fontSize: '24px' }}>Polymart</strong>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="http://localhost:3000">Home</Link>
        </li>
        <li>
          <Link to="http://localhost:3000/orders">My Orders</Link>
        </li>
        <li
          className="dropdown"
          onMouseEnter={() => setEcoDropdown(true)}
          onMouseLeave={() => setEcoDropdown(false)}
        >
          <span>
            <Link
              to={
                username ? `http://localhost:3002/?username=${username}` : 'http://localhost:3002'
              }
            >
              EcoUser
            </Link>
          </span>
          {ecoDropdown && (
            <ul className="dropdown-menu">
              <li>
                <Link to={`http://localhost:3002/PickupForm${username ? `?username=${username}` : ''}`}>
                  Pickup Request
                </Link>
              </li>
              <li>
                <Link
                  to={`http://localhost:3002/RecyclingTrackingPage${
                    username ? `?username=${username}` : ''
                  }`}
                >
                  Pickup Status
                </Link>
              </li>
              <li>
                <Link
                  to={`http://localhost:3002/RecyclerDashboard${
                    username ? `?username=${username}` : ''
                  }`}
                >
                  Recycler Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to={`http://localhost:3002/notifications${username ? `?username=${username}` : ''}`}
                >
                  Notifications
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li
          className="dropdown"
          onMouseEnter={() => setRewardDropdown(true)}
          onMouseLeave={() => setRewardDropdown(false)}
        >
          <span>
            <Link
              to={
                username ? `http://localhost:3004/?username=${username}` : 'http://localhost:3004'
              }
            >
              Reward & CashBack
            </Link>
          </span>
          {rewardDropdown && (
            <ul className="dropdown-menu">
              <li>
                <Link to={`http://localhost:3004/calculator${username ? `?username=${username}` : ''}`}>
                  Calculator
                </Link>
              </li>
              <li>
                <Link
                  to={`http://localhost:3004/leaderboard${username ? `?username=${username}` : ''}`}
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to={`http://localhost:3004/claim${username ? `?username=${username}` : ''}`}>
                  Claim Redeem
                </Link>
              </li>
              <li>
                <Link
                  to={`http://localhost:3004/ecolocation${username ? `?username=${username}` : ''}`}
                >
                  Eco Locations
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="http://localhost:3000/aboutus">About Us</Link>
        </li>
      </ul>

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
              <div className="profile-placeholder">{username.charAt(0).toUpperCase()}</div>
            )}
            <span
              className="username"
              onClick={() => (window.location.href = 'http://localhost:3001/profile')}
            >
              {username}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => (window.location.href = 'http://localhost:3001')}
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


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaShoppingCart } from "react-icons/fa";
// import logo from './Assests/images/polymart-logo.png';
// import './Header.css';

// export default function Header() {
//   const [ecoDropdown, setEcoDropdown] = useState(false);
//   const [rewardDropdown, setRewardDropdown] = useState(false);
//   const [username, setUsername] = useState(null);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const userFromURL = params.get('username');
//     const profileFromURL = params.get('profile');
  
//     if (userFromURL) {
//       localStorage.setItem('username', userFromURL);
//       if (profileFromURL) {
//         localStorage.setItem('profile', profileFromURL);
//       }
//       setUsername(userFromURL);
  
//       // Clean URL
//       const url = new URL(window.location);
//       url.search = '';
//       window.history.replaceState({}, document.title, url);
//     } else {
//       const storedUsername = localStorage.getItem('username');
//       if (storedUsername) {
//         setUsername(storedUsername);
//       } else {
//         setUsername(null); // Ensure logged-out state
//       }
//     }
//   }, []);
  

//   const handleLogout = () => {
//     try {
//       // 1. Clear local and session storage
//       localStorage.removeItem('username');
//       localStorage.removeItem('profile');
//       sessionStorage.removeItem('sessionToken');
  
//       // 2. Notify other windows (if any) about the logout
//       if (window.parent) {
//         window.parent.postMessage({ type: 'LOGOUT' }, '*');
//       }
  
//       // 3. Redirect to logout endpoint with redirect URL
//       const currentUrl = window.location.origin; // redirect to home instead of same page
//       const logoutUrl = `http://localhost:3002/logout?redirect=${encodeURIComponent(currentUrl)}`;
//       window.location.href = logoutUrl;
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };
  

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img src={logo} alt="Logo" className="logo" />
//         <strong style={{ color: 'white', fontSize: '24px' }}>Polymart</strong>
//       </div>

//       <ul className="nav-links">
//         <li><Link to="http://localhost:3000">Home</Link></li>
//         <li><Link to="http://localhost:3000/orders">My Orders</Link></li>
//         <li
//           className="dropdown"
//           onMouseEnter={() => setEcoDropdown(true)}
//           onMouseLeave={() => setEcoDropdown(false)}
//         >
//           <span>
//   <Link
//     to={username ? `http://localhost:3002/?username=${username}` : "http://localhost:3002"}
//     onClick={(e) => {
//       if (!username) {
//         e.preventDefault(); // Stop React Router navigation
//         window.location.href = "http://localhost:3002"; // Force full page redirect
//       }
//       setEcoDropdown(!ecoDropdown); // Toggle dropdown
//     }}
//   >
//     EcoUser
//   </Link>
// </span>
//           {ecoDropdown && (
//             <ul className="dropdown-menu">
//               <li><Link to="http://localhost:3002/PickupForm">Pickup Request</Link></li>
//               <li><Link to="http://localhost:3002/RecyclingTrackingPage">Pickup Status</Link></li>
//               <li><Link to="http://localhost:3002/RecyclerDashboard">Recycler Dashboard</Link></li>
//               <li><Link to="http://localhost:3002/notifications">Notifications</Link></li>
//             </ul>
//           )}
//         </li>

//         <li
//           className="dropdown"
//           onMouseEnter={() => setRewardDropdown(true)}
//           onMouseLeave={() => setRewardDropdown(false)}
//         >
//           <span>
//             <Link
//               to={username ? `http://localhost:3004/?username=${username}` : "http://localhost:3004"}
//               onClick={() => setRewardDropdown(!rewardDropdown)}
//             >
//               Reward & CashBack
//             </Link>
//           </span>
//           {rewardDropdown && (
//             <ul className="dropdown-menu">
//               <li><Link to="http://localhost:3004/calculator">Calculator</Link></li>
//               <li><Link to="http://localhost:3004/leaderboard">Leaderboard</Link></li>
//               <li><Link to="http://localhost:3004/claim">Claim Redeem</Link></li>
//               <li><Link to="http://localhost:3004/ecolocation">Eco Locations</Link></li>
//             </ul>
//           )}
//         </li>

//         <li><Link to="http://localhost:3000/aboutus">About Us</Link></li>
//       </ul>

//       <div className="navbar-right">
//         {username ? (
//           <div className="user-info">
//             {localStorage.getItem('profile') ? (
//               <img
//                 src={localStorage.getItem('profile')}
//                 alt="Profile"
//                 className="profile-pic"
//               />
//             ) : (
//               <div className="profile-placeholder">
//                 {username.charAt(0).toUpperCase()}
//               </div>
//             )}
//             <span
//               className="username"
//               onClick={() => window.location.href = "http://localhost:3001/profile"}
//             >
//               {username}
//             </span>
//             <button className="logout-btn" onClick={handleLogout}>Logout</button>
//           </div>
//         ) : (
//           <button
//             className="login-btn"
//             onClick={() => window.location.href = "http://localhost:3001"}
//           >
//             Login
//           </button>
//         )}
//         <Link to="http://localhost:3000/cart" className="cart-icon">
//           <FaShoppingCart size={20} />
//         </Link>
//       </div>
//     </nav>
//   );
// }




