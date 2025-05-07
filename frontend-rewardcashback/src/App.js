import React,{useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

import Maindash from './maindash';
import Leaderboard from './leaderboard';
import Calculator from './redeem';
import HeaderRedeem from './componets/headerRedeem'; // ✅ Use PascalCase when importing components
import Claim from './RedeemPage';
import Ecolocation from './ecolocation'; // ✅ Use PascalCase when importing components
import Footer from './componets/Footer'; // ✅ Use PascalCase when importing components

// Optional: Conditional layout wrapper if you only want header on certain routes
function Layout() {
  const location = useLocation();

  // Example: don't show navbar on "/login" or "/register" pages
  const hideHeader = location.pathname === "/login" || location.pathname === "/register";
  useEffect(() => {
    const loginChannel = new BroadcastChannel('auth_channel');

    loginChannel.onmessage = (event) => {
      const { type, username, token } = event.data;

      if (type === 'LOGIN') {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        window.location.reload(); // Refresh app to reflect login
      }

      if (type === 'LOGOUT') {
        localStorage.clear();
        window.location.href = '/';
      }
    };

    return () => loginChannel.close(); // Cleanup on unmount
  }, []);

  return (
    <>
      {!hideHeader && <HeaderRedeem />}
      <Routes>
        <Route path="/" element={<Maindash />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/Calculator" element={<Calculator />} />
        <Route path="/Claim" element={<Claim />} />
        <Route path="/Ecolocation" element={<Ecolocation />} />
      </Routes>
     <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;