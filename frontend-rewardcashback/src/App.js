import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Maindash from './maindash';  // Import Dashboard component
import Leaderboard from './leaderboard';  // Import Leaderboard component
import Redeem from './redeem';


function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard Route */}
        <Route path="/" element={<Maindash />} />

        {/* Leaderboard Route */}
        
        
        <Route path="/leaderboard" element={<Leaderboard />} />

        
        <Route path="/redeem" element={<Redeem />} />
        
      </Routes>
    </Router>
  );
}

export default App;
