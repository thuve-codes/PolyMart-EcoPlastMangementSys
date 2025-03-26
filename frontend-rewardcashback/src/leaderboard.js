import React, { useState } from 'react';
import './leaderboard.css';

import logo from './assets/images/polymart-logo.png';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [score, setScore] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Add new leaderboard entry
  const handleAdd = (e) => {
    e.preventDefault();
    if (username && score) {
      const newLeaderboard = [...leaderboard, { id: Date.now(), username, score: parseInt(score) }];
      setLeaderboard(newLeaderboard);
      setUsername('');
      setScore('');
    } else {
      alert('Please fill in both fields.');
    }
  };

  // Edit an existing leaderboard entry
  const handleEdit = (index) => {
    setEditIndex(index);
    setUsername(leaderboard[index].username);
    setScore(leaderboard[index].score);
  };

  // Save the updated leaderboard entry
  const handleUpdate = (e) => {
    e.preventDefault();
    if (username && score) {
      const updatedLeaderboard = leaderboard.map((entry, index) =>
        index === editIndex ? { ...entry, username, score: parseInt(score) } : entry
      );
      setLeaderboard(updatedLeaderboard);
      setUsername('');
      setScore('');
      setEditIndex(null);
    } else {
      alert('Please fill in both fields.');
    }
  };

  // Delete leaderboard entry
  const handleDelete = (id) => {
    const updatedLeaderboard = leaderboard.filter(entry => entry.id !== id);
    setLeaderboard(updatedLeaderboard);
  };

  return (
    <>{/* Navigation Bar */}
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Polymart Logo" className="logo" />
      </div>
      <ul>
        <li><a href="/">Dashboard</a></li>
        <li><a href="/redeem">Redeem</a></li>
        <li><a href="/leaderboard">Leaderboard</a></li>
        <li><a href="#">Notifications</a></li>
      </ul>
    </nav>
    <div className="leaderboard-container">

        

      <h1>Leaderboard</h1>

      <form className="leaderboard-form" onSubmit={editIndex === null ? handleAdd : handleUpdate}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Score:</label>
          <input 
            type="number" 
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">{editIndex === null ? 'Add Entry' : 'Update Entry'}</button>
      </form>

      <h2>Leaderboard:</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.id}>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </>
  );
}

export default Leaderboard;
