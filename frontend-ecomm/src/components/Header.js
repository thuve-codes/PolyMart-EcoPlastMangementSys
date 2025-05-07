import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import polymartLogo from './images/polymart-logo.png';
import { FaShoppingCart } from 'react-icons/fa';
import '../App.css';

export default function Header({ cartItems }) {
  const location = useLocation();
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    };

    const handleMessage = (event) => {
      if (
        !['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3004'].includes(
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

    const params = new URLSearchParams(window.location.search);
    const userFromURL = params.get('username');
    const profileFromURL = params.get('profile');
    if (userFromURL) {
      localStorage.setItem('username', userFromURL);
      if (profileFromURL) localStorage.setItem('profile', profileFromURL);
      setUsername(userFromURL);
      const url = new URL(window.location);
      url.search = '';
      window.history.replaceState({}, document.title, url);
    }

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

    const message = { type: 'LOGOUT' };
    const targetOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3004',
    ];
    targetOrigins.forEach((origin) => {
      window.postMessage(message, origin);
    });
  };

  const handleLogout = () => {
    broadcastLogout();
    window.location.href = 'http://localhost:3000';
  };

  const isLoggedIn = !!username;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={polymartLogo}
            alt="Polymart Logo"
            className="logo"
            style={{ maxHeight: '50px', objectFit: 'contain', marginRight: '10px' }}
          />
          Poly EStore
        </Link>

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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="col-12 col-md-6 mt-2 mt-md-0"></div>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="navbar">
            <li className="nav-item">
              <Link to="/" className={`nav-link navname ${location.pathname === '/' ? 'active' : ''}`}>
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
              <a
                className={`nav-link navname dropdown-toggle ${location.pathname === '/Home' ? 'active' : ''}`}
                href={username ? `http://localhost:3002/Home?username=${username}` : 'http://localhost:3002/Home'}
                id="ecoUserDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                EcoUser
              </a>
              <ul className="dropdown-menu" aria-labelledby="ecoUserDropdown">
                <li>
                  <a
                    href={`http://localhost:3002/PickupForm${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Pickup Request
                  </a>
                </li>
                <li>
                  <a
                    href={`http://localhost:3002/RecyclingTrackingPage${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Pickup Status
                  </a>
                </li>
                <li>
                  <a
                    href={`http://localhost:3002/RecyclerDashboard${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Recycler Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href={`http://localhost:3002/PickupStatusPage${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Notifications
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link navname dropdown-toggle"
                href={username ? `http://localhost:3004/?username=${username}` : 'http://localhost:3004'}
                id="rewardDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Reward & CashBack
              </a>
              <ul className="dropdown-menu" aria-labelledby="rewardDropdown">
                <li>
                  <a
                    href={`http://localhost:3004/Calculator${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Calculator
                  </a>
                </li>
                <li>
                  <a
                    href={`http://localhost:3004/leaderboard${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Leaderboard
                  </a>
                </li>
                <li>
                  <a
                    href={`http://localhost:3004/Claim${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Claim Redeem
                  </a>
                </li>
                <li>
                  <a
                    href={`http://localhost:3004/Ecolocation${username ? `?username=${username}` : ''}`}
                    className="dropdown-item"
                  >
                    Eco Locations
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link
                to="/aboutus"
                className={`nav-link navname ${location.pathname === '/aboutus' ? 'active' : ''}`}
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-left d-flex justify-content-end align-items-center">
          {isLoggedIn ? (
            <div className="d-flex align-items-center" style={{ padding: '8px' }}>
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                style={{ width: '30px', height: '30px', marginRight: '8px' }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <span
                className="navname me-2 pa"
                style={{ marginRight: '8px', padding: '4px', cursor: 'pointer' }}
                onClick={() => {
                  window.location.href = 'http://localhost:3001/profile';
                }}
              >
                {username}
              </span>
              <button
                className="btn btn-outline-danger navname p-2"
                id="logout_btn"
                onClick={handleLogout}
                style={{ padding: '8px' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn navname"
              id="login_btn"
              onClick={() => {
                window.location.href = 'http://localhost:3001';
              }}
            >
              Login
            </button>
          )}
          <Link to="/cart">
            <span id="cart" className="ml-3 navname">
              <FaShoppingCart size={20} />
            </span>
            <span className="ml-1 navname" id="cart_count">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}




// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import polymartLogo from "./images/polymart-logo.png";
// import { FaShoppingCart } from "react-icons/fa";
// import '../App.css';

// export default function Header({ cartItems }) {
//   const location = useLocation();
//   const [username, setUsername] = useState(null);

//   // Sync auth state across tabs/windows
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === 'username') {
//         setUsername(e.newValue);
//       }
//     };

//     // Check initial state
//     const storedUsername = localStorage.getItem('username');
//     setUsername(storedUsername);

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   // Handle URL params on initial load
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const userFromURL = params.get('username');
//     const profileFromURL = params.get('profile');

//     if (userFromURL) {
//       localStorage.setItem('username', userFromURL);
//       if (profileFromURL) localStorage.setItem('profile', profileFromURL);
//       setUsername(userFromURL);

//       // Clean up URL
//       const url = new URL(window.location);
//       url.search = "";
//       window.history.replaceState({}, document.title, url);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('username');
//     localStorage.removeItem('profile');
//     window.dispatchEvent(new Event('storage'));
//     window.location.href = "http://localhost:3000";
//   };

//   const isLoggedIn = !!username;

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar" id="navbar">
//       <div className="container-fluid">
//         {/* Brand Logo */}
//         <div className="navbar-brand navname" href="#">
//           <Link to="/" className="nav-brand-link">
//             <img
//               src={polymartLogo}
//               alt="Polymart Logo"
//               className="logo"
//               style={{ maxHeight: '50px', objectFit: 'contain' }}
//             />{" "}
//             <span className="brand-text">Poly EStore</span>
//           </Link>
//         </div>

//         {/* Navbar Toggle Button */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//           aria-controls="navbarSupportedContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar Links */}
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <div className="col-12 col-md-6 mt-2 mt-md-0"></div>

//           <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="navbar">
//             <li className="nav-item">
//               <Link 
//                 to="/" 
//                 className={`nav-link navname ${location.pathname === '/' ? 'active' : ''}`}
//               >
//                 Home
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link 
//                 to="/orders" 
//                 className={`nav-link navname ${location.pathname === '/orders' ? 'active' : ''}`}
//               >
//                 My Orders
//               </Link>
//             </li>

//             <li className="nav-item dropdown">
//             <Link 
//               className={`nav-link navname ${location.pathname === '/Home' ? 'active' : ''}`} 
//               to={username ? `http://localhost:3002/Home?username=${username}` : "http://localhost:3002/Home"}
//               id="ecoUserDropdown" 
//               role="button" 
//               aria-expanded="false"
//               onClick={(e) => {
//                 if (username === null) {
//                   e.preventDefault();
//                   // Choose either option below:
                  
//                   // Option 1: Full page redirect (recommended if 3002 is a different app)
//                   window.location.href = "http://localhost:3002/Home";

                  
//                   // Option 2: React Router navigation (if within same app)
//                   // navigate("/Home"); // Requires: const navigate = useNavigate();
//                 }
//               }}
//             >
//               EcoUser
//             </Link>
//               <ul className="dropdown-menu" aria-labelledby="ecoUserDropdown">
//                 <li>
//                   <Link to="http://localhost:3002/PickupForm" className="dropdown-item">Pickup Request</Link>
//                 </li>
//                 <li>
//                   <Link to="http://localhost:3002/RecyclingTrackingPage" className="dropdown-item">Pickup Status</Link>
//                 </li>
//                 <li>
//                   <Link to="http://localhost:3002/RecyclerDashboard" className="dropdown-item">Recycler Dashboard</Link>
//                 </li>
//                 <li>
//                   <Link to="http://localhost:3002/PickupStatusPage" className="dropdown-item">Notifications</Link>
//                 </li>
//               </ul>
//             </li>

//             <li className="nav-item dropdown">
//               <Link
//                 className="nav-link navname"
//                 to={username ? `http://localhost:3004/?username=${username}` : "http://localhost:3004"}
//                 id="rewardDropdown"
//                 role="button"
//                 aria-expanded="false"
//               >
//                 Reward & CashBack
//               </Link>
//               <ul className="dropdown-menu" aria-labelledby="rewardDropdown">
//                 <li>
//                   <a href={`http://localhost:3004/Calculator?username=${username}`} className="dropdown-item">Calculator</a>
//                 </li>
//                 <li>
//                   <a href={`http://localhost:3004/leaderboard?username=${username}`} className="dropdown-item">Leaderboard</a>
//                 </li>
//                 <li>
//                   <a href={`http://localhost:3004/Claim?username=${username}`} className="dropdown-item">Claim Redeem</a>
//                 </li>
//                 <li>
//                   <a href={`http://localhost:3004/Ecolocation?username=${username}`} className="dropdown-item">Eco Locations</a>
//                 </li>
//               </ul>
//             </li>

//             <li className="nav-item">
//               <Link 
//                 to="/aboutus"  
//                 className={`nav-link navname ${location.pathname === '/aboutus' ? 'active' : ''}`}
//               >
//                 About Us
//               </Link>
//             </li>
//           </ul>
//         </div>

//         <div className="col-12 col-md-3 mt-4 mt-md-0 text-left d-flex justify-content-end align-items-center">
//           {isLoggedIn ? (
//             <>
//               <div className="d-flex align-items-center" style={{ padding: '8px' }}>
//                 <div
//                   className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
//                   style={{ width: '30px', height: '30px', marginRight: '8px' }}
//                 >
//                   {username.charAt(0).toUpperCase()}
//                 </div>
//                 <span 
//                   className="navname me-2 pa" 
//                   style={{ marginRight: '8px', padding: '4px' }}
//                   onClick={() => {
//                     window.location.href = "http://localhost:3001/profile";
//                   }}
//                 >
//                   {username}
//                 </span>
//                 <button
//                   className="btn btn-outline-danger navname p-2"
//                   id="logout_btn"
//                   onClick={handleLogout}
//                   style={{ padding: '8px' }}
//                 >
//                   Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <button
//               className="btn navname"
//               id="login_btn"
//               onClick={() => {
//                 window.location.href = "http://localhost:3001";
//               }}
//             >
//               Login
//             </button>
//           )}
//           <Link to="/cart">
//             <span id="cart" className="ml-3 navname">
//               <FaShoppingCart size={20} />
//             </span>
//             <span className="ml-1 navname" id="cart_count">{cartItems.length}</span>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }