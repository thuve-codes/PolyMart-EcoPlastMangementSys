import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import Maindash from './maindash';
import Leaderboard from './leaderboard';
import Calculator from './redeem';
import HeaderRedeem from './componets/headerRedeem'; // ✅ Use PascalCase when importing components
import Claim from './RedeemPage';
import RewardDashboard from './RewardDashboard'; // ✅ Use PascalCase when importing components


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
        <Route path="/Calculator" element={<Calculator />} />
        <Route path="/Claim" element={<Claim />} />
        <Route path="/RewardDashboard" element={<RewardDashboard />} />
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