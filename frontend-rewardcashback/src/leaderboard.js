import React, { useState } from "react";
import "./leaderboard.css";
import logo from "./assets/images/polymart-logo.png";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rank, setRank] = useState("");
  const [plasticRecycled, setPlasticRecycled] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [redemptionStatus, setRedemptionStatus] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Add new leaderboard entry
  const handleAdd = (e) => {
    e.preventDefault();
    if (!username || !email || !rank || plasticRecycled === "" || rewardPoints === "" || !redemptionStatus) {
      alert("Please fill in all fields.");
      return;
    }
    if (plasticRecycled < 0 || rewardPoints < 0) {
      alert("Plastic Recycled and Reward Points cannot be negative.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      username,
      email,
      rank,
      plasticRecycled: parseFloat(plasticRecycled),
      rewardPoints: parseInt(rewardPoints),
      redemptionStatus,
    };

    setLeaderboard([...leaderboard, newEntry]);
    resetForm();
  };

  // Edit an existing leaderboard entry
  const handleEdit = (index) => {
    setEditIndex(index);
    const entry = leaderboard[index];
    setUsername(entry.username);
    setEmail(entry.email);
    setRank(entry.rank);
    setPlasticRecycled(entry.plasticRecycled);
    setRewardPoints(entry.rewardPoints);
    setRedemptionStatus(entry.redemptionStatus);
  };

  // Save the updated leaderboard entry
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!username || !email || !rank || plasticRecycled === "" || rewardPoints === "" || !redemptionStatus) {
      alert("Please fill in all fields.");
      return;
    }
    if (plasticRecycled < 0 || rewardPoints < 0) {
      alert("Plastic Recycled and Reward Points cannot be negative.");
      return;
    }

    const updatedLeaderboard = leaderboard.map((entry, index) =>
      index === editIndex
        ? { ...entry, username, email, rank, plasticRecycled: parseFloat(plasticRecycled), rewardPoints: parseInt(rewardPoints), redemptionStatus }
        : entry
    );

    setLeaderboard(updatedLeaderboard);
    resetForm();
  };

  // Delete leaderboard entry
  const handleDelete = (id) => {
    const updatedLeaderboard = leaderboard.filter((entry) => entry.id !== id);
    setLeaderboard(updatedLeaderboard);
  };

  // Reset the form fields
  const resetForm = () => {
    setUsername("");
    setEmail("");
    setRank("");
    setPlasticRecycled("");
    setRewardPoints("");
    setRedemptionStatus("");
    setEditIndex(null);
  };

  return (
    <>
      

      <div className="leaderboard-container">

        <h2>Leaderboard:</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Rank</th>
              <th>Plastic Recycled (kg)</th>
              <th>Reward Points</th>
              <th>Redemption Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id}>
                <td>{entry.username}</td>
                <td>{entry.email}</td>
                <td>{entry.rank}</td>
                <td>{entry.plasticRecycled}</td>
                <td>{entry.rewardPoints}</td>
                <td>{entry.redemptionStatus}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(entry.id)}>Delete</button>
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
