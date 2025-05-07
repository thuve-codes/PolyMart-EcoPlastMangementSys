import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from './Assests/images/polymart-logo.png';
import './Header.css';

export default function Header() {
  const [ecoDropdown, setEcoDropdown] = useState(false);
  const [rewardDropdown, setRewardDropdown] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.type === 'LOGOUT') {
        localStorage.removeItem('username');
        localStorage.removeItem('profile');
        setUsername(null);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const userFromURL = params.get('username');
    const profileFromURL = params.get('profile');

    if (userFromURL) {
      localStorage.setItem('username', userFromURL);
      if (profileFromURL) {
        localStorage.setItem('profile', profileFromURL);
      }
      setUsername(userFromURL);

      // Clean URL
      const url = new URL(window.location);
      url.search = '';
      window.history.replaceState({}, document.title, url);
    } else {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername(null);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);



  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="logo" />
        <strong style={{ color: 'white', fontSize: '24px' }}>Polymart</strong>
      </div>

      <ul className="nav-links">
        <li><Link to="http://localhost:3000">Home</Link></li>
        <li><Link to="http://localhost:3000/orders">My Orders</Link></li>
        <li
          className="dropdown"
          onMouseEnter={() => setEcoDropdown(true)}
          onMouseLeave={() => setEcoDropdown(false)}
        >
          <span>
            <Link
              to={username ? `http://localhost:3002/?username=${username}` : "http://localhost:3002"}
              onClick={(e) => {
                if (!username) {
                  e.preventDefault();
                  window.location.href = "http://localhost:3002";
                }
                setEcoDropdown(!ecoDropdown);
              }}
            >
              EcoUser
            </Link>
          </span>
          {ecoDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="http://localhost:3002/PickupForm">Pickup Request</Link></li>
              <li><Link to="http://localhost:3002/RecyclingTrackingPage">Pickup Status</Link></li>
              <li><Link to="http://localhost:3002/RecyclerDashboard">Recycler Dashboard</Link></li>
              <li><Link to="http://localhost:3002/notifications">Notifications</Link></li>
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
              to={username ? `http://localhost:3004/?username=${username}` : "http://localhost:3004"}
              onClick={() => setRewardDropdown(!rewardDropdown)}
            >
              Reward & CashBack
            </Link>
          </span>
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

      <div className="navbar-right">
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




