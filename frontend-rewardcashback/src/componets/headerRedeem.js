import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import logo from '../assets/images/polymart-logo.png';

function HeaderRedeem() {
  const location = useLocation();
  const [ecoUserDropdown, setEcoUserDropdown] = useState(false);
  const [rewardDropdown, setRewardDropdown] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username'));

  // Handle login/logout messages
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    };

    const handleMessage = (event) => {
      const { type, username: u, profile } = event.data || {};
      if (type === 'LOGOUT') {
        localStorage.removeItem('username');
        localStorage.removeItem('profile');
        localStorage.removeItem('token');
        setUsername(null);
      } else if (type === 'LOGIN' && u) {
        localStorage.setItem('username', u);
        if (profile) localStorage.setItem('profile', profile);
        setUsername(u);
      }
    };

    // If login data in URL, set it
    const params = new URLSearchParams(window.location.search);
    const userFromURL = params.get('username');
    const profileFromURL = params.get('profile');
    if (userFromURL) {
      localStorage.setItem('username', userFromURL);
      if (profileFromURL) localStorage.setItem('profile', profileFromURL);
      setUsername(userFromURL);

      // Clear URL params after reading
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
    setUsername(null);

    // Broadcast logout to all apps
    window.postMessage({ type: 'LOGOUT' }, '*');
  };

  const handleLogout = () => {
    broadcastLogout();
    window.location.href = 'http://localhost:3004';
  };

  const navStyles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#343a40',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: '100%',
      boxSizing: 'border-box',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'white',
      flexShrink: 0,
      textDecoration: 'none',
    },
    logo: {
      height: '40px',
      width: 'auto',
    },
    centerNav: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      gap: '2rem',
      flex: 1,
    },
    rightNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexShrink: 0,
    },
    link: {
      textDecoration: 'none',
      color: '#fff',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
    },
    activeLink: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '180px',
      padding: '0.5rem 0',
      borderRadius: '4px',
    },
    dropdownItem: {
      padding: '0.5rem 1rem',
      textDecoration: 'none',
      color: '#333',
      display: 'block',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.2s ease',
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      fontSize: '14px',
      gap: '10px',
      backgroundColor: '#007bff',
      padding: '6px 12px',
      borderRadius: '20px',
      flexShrink: 0,
    },
    userIcon: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      objectFit: 'cover',
      backgroundColor: '#6c757d',
      flexShrink: 0,
    },
    usernameText: {
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    logoutButton: {
      padding: '6px 12px',
      backgroundColor: '#dc3545',
      marginTop: '0',
      border: 'none',
      color: 'white',
      fontSize: '14px',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
  };

  return (
    <nav style={navStyles.navbar}>
      <Link to="http://localhost:3000/" style={navStyles.logoContainer}>
        <img src={logo} alt="Polymart Logo" style={navStyles.logo} />
        Poly Mart
      </Link>

      <ul style={navStyles.centerNav}>
        <li>
          <Link
            to="http://localhost:3000/"
            style={{
              ...navStyles.link,
              ...(location.pathname === '/' && navStyles.activeLink),
            }}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="http://localhost:3000/orders"
            style={{
              ...navStyles.link,
              ...(location.pathname === '/orders' && navStyles.activeLink),
            }}
          >
            My Orders
          </Link>
        </li>
        <li
          onMouseEnter={() => setEcoUserDropdown(true)}
          onMouseLeave={() => setEcoUserDropdown(false)}
          style={{ position: 'relative' }}
        >
          <span style={{ ...navStyles.link, cursor: 'pointer' }}>
            <Link
              to={
                username ? `http://localhost:3002/?username=${username}` : 'http://localhost:3002'
              }
              style={{
                ...navStyles.link,
                ...(location.pathname.startsWith('/eco') && navStyles.activeLink),
              }}
            >
              Eco User ▾
            </Link>
          </span>
          {ecoUserDropdown && (
            <div style={navStyles.dropdown}>
              <Link
                to={`http://localhost:3002/PickupForm${username ? `?username=${username}` : ''}`}
                style={navStyles.dropdownItem}
              >
                Pickup Request
              </Link>
              <Link
                to={`http://localhost:3002/RecyclingTrackingPage${username ? `?username=${username}` : ''}`}
                style={navStyles.dropdownItem}
              >
                Pickup Status
              </Link>
              <Link
                to={`http://localhost:3002/RecyclerDashboard${username ? `?username=${username}` : ''}`}
                style={navStyles.dropdownItem}
              >
                Recycler Dashboard
              </Link>
              <Link
                to={`http://localhost:3002/PickupStatusPage${username ? `?username=${username}` : ''}`}
                style={navStyles.dropdownItem}
              >
                Notifications
              </Link>
            </div>
          )}
        </li>
        <li
          onMouseEnter={() => setRewardDropdown(true)}
          onMouseLeave={() => setRewardDropdown(false)}
          style={{ position: 'relative' }}
        >
          <span style={{ ...navStyles.link, cursor: 'pointer' }}>
            <Link
              to="/"
              style={{
                ...navStyles.link,
                ...(location.pathname === '/' && navStyles.activeLink),
              }}
            >
              Reward & Cashback ▾
            </Link>
          </span>
          {rewardDropdown && (
            <div style={navStyles.dropdown}>
              <Link to="/calculator" style={navStyles.dropdownItem}>
                Calculator
              </Link>
              <Link to="/leaderboard" style={navStyles.dropdownItem}>
                Leaderboard
              </Link>
              <Link to="/claim" style={navStyles.dropdownItem}>
                Claim Redeem
              </Link>
              <Link to="/ecolocation" style={navStyles.dropdownItem}>
                Eco Locations
              </Link>
            </div>
          )}
        </li>
        <li>
          <Link
            to="http://localhost:3000/aboutus"
            style={{
              ...navStyles.link,
              ...(location.pathname === '/aboutus' && navStyles.activeLink),
            }}
          >
            About Us
          </Link>
        </li>
      </ul>

      <div style={navStyles.rightNav}>
        {username ? (
          <div style={navStyles.userProfile}>
            {localStorage.getItem('profile') ? (
              <img
                src={localStorage.getItem('profile')}
                alt="Profile"
                style={navStyles.userIcon}
              />
            ) : (
              <div
                style={{
                  ...navStyles.userIcon,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              style={navStyles.usernameText}
              onClick={() => {
                window.location.href = 'http://localhost:3001/profile';
              }}
            >
              {username}
            </span>
            <button onClick={handleLogout} style={navStyles.logoutButton}>
              Logout
            </button>
          </div>
        ) : (
          <button
            style={{
              ...navStyles.link,
              backgroundColor: '#007bff',
              padding: '6px 12px',
              borderRadius: '20px',
            }}
            onClick={() => {
              window.location.href = 'http://localhost:3001';
            }}
          >
            Login
          </button>
        )}
        <Link to="http://localhost:3000/cart" style={navStyles.link}>
          <FaShoppingCart size={20} />
        </Link>
      </div>
    </nav>
  );
}

export default HeaderRedeem;




// import { Link, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { FaShoppingCart } from 'react-icons/fa';
// import logo from '../assets/images/polymart-logo.png';

// function HeaderRedeem() {
//   const location = useLocation();
//   const [ecoUserDropdown, setEcoUserDropdown] = useState(false);
//   const [rewardDropdown, setRewardDropdown] = useState(false);
//   const [username, setUsername] = useState(null);

//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username');
//     if (storedUsername) {
//       setUsername(storedUsername);
//     } else {
//       const params = new URLSearchParams(window.location.search);
//       const userFromURL = params.get('username');
//       const profileFromURL = params.get('profile');

//       if (userFromURL) {
//         localStorage.setItem('username', userFromURL);
//         if (profileFromURL) localStorage.setItem('profile', profileFromURL);
//         setUsername(userFromURL);

//         // Clean up URL to avoid showing params after redirect
//         const url = new URL(window.location);
//         url.search = '';
//         window.history.replaceState({}, document.title, url);
//       }
//     }
//   }, []);

//    // Function to handle logout
//    const handleLogout = () => {
//     localStorage.removeItem('username');
//     localStorage.removeItem('profile');
//     setUsername(null);
//     window.location.href = "http://localhost:3000";
//   };

//   const navStyles = {
//     navbar: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '1rem 2rem',
//       backgroundColor: '#343a40',
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//       width: '100%',
//       boxSizing: 'border-box', // Ensure padding doesn't cause overflow
//     },
//     logoContainer: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.5rem',
//       color: 'white',
//       flexShrink: 0, // Prevent logo from shrinking
//     },
//     logo: {
//       height: '40px',
//       width: 'auto', // Ensure logo maintains aspect ratio
//     },
//     centerNav: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       listStyle: 'none',
//       margin: 0,
//       padding: 0,
//       gap: '2rem', // Increased gap for better spacing
//       flex: 1, // Allow center nav to take available space
//     },
//     rightNav: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '1.5rem', // Increased gap for better spacing
//       flexShrink: 0, // Prevent right nav from shrinking
//     },
//     link: {
//       textDecoration: 'none',
//       color: '#fff',
//       padding: '0.5rem 1rem',
//       borderRadius: '4px',
//       transition: 'all 0.3s ease',
//       display: 'flex', // Ensure consistent alignment for links
//       alignItems: 'center',
//     },
//     activeLink: {
//       backgroundColor: '#007bff',
//       color: 'white',
//     },
//     dropdown: {
//       position: 'absolute',
//       top: '100%',
//       left: '0', // Align dropdown with parent
//       backgroundColor: '#fff',
//       boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//       zIndex: 1000,
//       minWidth: '180px',
//       padding: '0.5rem 0',
//       borderRadius: '4px', // Add border radius for consistency
//     },
//     dropdownItem: {
//       padding: '0.5rem 1rem',
//       textDecoration: 'none',
//       color: '#333',
//       display: 'block',
//       whiteSpace: 'nowrap',
//       transition: 'background-color 0.2s ease',
//     },
//     userProfile: {
//       display: 'flex',
//       alignItems: 'center',
//       color: 'white',
//       fontSize: '14px',
//       gap: '10px', // Slightly increased gap for clarity
//       backgroundColor: '#007bff',
//       padding: '6px 12px', // Adjusted padding for balance
//       borderRadius: '20px',
//       flexShrink: 0, // Prevent compression
//     },
//     userIcon: {
//       width: '30px',
//       height: '30px',
//       borderRadius: '50%',
//       objectFit: 'cover',
//       backgroundColor: '#6c757d',
//       flexShrink: 0, // Prevent icon from shrinking
//     },
//     usernameText: {
//       color: 'white',
//       fontWeight: 'bold',
//       cursor: 'pointer',
//       whiteSpace: 'nowrap', // Prevent username from wrapping
//     },
//     logoutButton: {
//       padding: '6px 12px', // Adjusted for better alignment
//       backgroundColor: '#dc3545',
//       marginTop: '0',
//       border: 'none',
//       color: 'white',
//       fontSize: '14px',
//       borderRadius: '20px',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s ease',
//     },
//   };

//   return (
//     <nav style={navStyles.navbar}>
//       {/* Logo */}
//       <div style={navStyles.logoContainer}>
//         <Link to="http://localhost:3000/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
//           <img src={logo} alt="Polymart Logo" style={navStyles.logo} />
//           <strong>Poly Mart</strong>
//         </Link>
//       </div>

//       {/* Center Nav */}
//       <ul style={navStyles.centerNav}>
//         <li>
//           <Link
//             to="http://localhost:3000/"
//             style={{
//               ...navStyles.link
//             }}
//           >
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link
//             to="http://localhost:3000/orders"
//             style={{
//               ...navStyles.link
//             }}
//           >
//             My Orders
//           </Link>
//         </li>
//         {/* Eco User Dropdown */}
//         <li
//           onMouseEnter={() => setEcoUserDropdown(true)}
//           onMouseLeave={() => setEcoUserDropdown(false)}
//           style={{ position: 'relative' }}
//         >
//           <span style={{ ...navStyles.link, cursor: 'pointer' }}>
//           <Link to={username ? `http://localhost:3002/?username=${username}` : "http://localhost:3002"}
//            style={{
//               ...navStyles.link,
//               ...(location.pathname === 'http://localhost:3002/Home' && navStyles.activeLink),
//             }}>
//             Eco User ▾</Link>
//           </span>
//           {ecoUserDropdown && (
//             <div style={navStyles.dropdown}>
//               <Link to="http://localhost:3002/PickupForm" style={navStyles.dropdownItem}>
//                 Pickup Request
//               </Link>
//               <Link to="http://localhost:3002/RecyclingTrackingPage" style={navStyles.dropdownItem}>
//                 Pickup Status
//               </Link>
//               <Link to="http://localhost:3002/RecyclerDashboard" style={navStyles.dropdownItem}>
//                 Recycler Dashboard
//               </Link>
//               <Link to="http://localhost:3002/PickupStatusPage" style={navStyles.dropdownItem}>
//                 Notifications
//               </Link>
//             </div>
//           )}
//         </li>
//         {/* Reward & Cashback Dropdown */}
//         <li
//           onMouseEnter={() => setRewardDropdown(true)}
//           onMouseLeave={() => setRewardDropdown(false)}
//           style={{ position: 'relative' }}
//         >
//           <span style={{ ...navStyles.link, cursor: 'pointer' }}>
//           <Link to="/" style={{
//               ...navStyles.link,
//               ...(location.pathname === '/' && navStyles.activeLink),
//             }}>
//           Reward & Cashback
//               </Link>
//             ▾</span>
//           {rewardDropdown && (
//             <div style={navStyles.dropdown}>
//               <Link to="/calculator" style={navStyles.dropdownItem}>
//                 Calculator
//               </Link>
//               <Link to="/leaderboard" style={navStyles.dropdownItem}>
//                 Leaderboard
//               </Link>
//               <Link to="/claim" style={navStyles.dropdownItem}>
//                 Claim Redeem
//               </Link>
//               <Link to="/ecolocation" style={navStyles.dropdownItem}>
//                 Eco Locations
//               </Link>
//             </div>
//           )}
//         </li>
//         <li>
//           <Link
//             to="http://localhost:3000/aboutus"
//             style={{
//               ...navStyles.link,
//               ...(location.pathname === '/aboutus' && navStyles.activeLink),
//             }}
//           >
//             About Us
//           </Link>
//         </li>
//       </ul>

//       {/* Right Nav */}
//       <div style={navStyles.rightNav}>
//         {username ? (
//           <div style={navStyles.userProfile}>
//             {localStorage.getItem('profile') ? (
//               <img
//                 src={localStorage.getItem('profile')}
//                 alt="Profile"
//                 style={navStyles.userIcon}
//               />
//             ) : (
//               <div
//                 style={{
//                   ...navStyles.userIcon,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: 'white',
//                 }}
//               >
//                 {username.charAt(0).toUpperCase()}
//               </div>
//             )}

//             <span
//               style={navStyles.usernameText}
//               onClick={() => {
//                 window.location.href = "http://localhost:3001/profile";
//               }}
//             >
//               {username}
//             </span>

//             <button
//               onClick={handleLogout}
//               style={navStyles.logoutButton}
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <button
//             style={{
//               ...navStyles.link,
//               backgroundColor: '#007bff',
//               padding: '6px 12px',
//               borderRadius: '20px',
//             }}
//             onClick={() => {
//               window.location.href = "http://localhost:3001";
//             }}
//           >
//             Login
//           </button>
//         )}

//         {/* Cart Button */}
//         <Link to="http://localhost:3000/cart" style={navStyles.link}>
//           <FaShoppingCart size={20} />
//         </Link>
//       </div>
//     </nav>
//   );
// }

// export default HeaderRedeem;
