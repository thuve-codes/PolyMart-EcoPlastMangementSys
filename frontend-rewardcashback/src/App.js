import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import Maindash from './maindash';
import Leaderboard from './leaderboard';
import Redeem from './redeem';
import Notification from './Notification';
import HeaderRedeem from './componets/headerRedeem'; // ✅ Use PascalCase when importing components

// Optional: Conditional layout wrapper if you only want header on certain routes
function Layout() {
  const location = useLocation();

  // Example: don't show navbar on "/login" or "/register" pages
  const hideHeader = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideHeader && <HeaderRedeem />}
      <Routes>
        <Route path="/" element={<Maindash />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/notifications" element={<Notification />} />
      </Routes>
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