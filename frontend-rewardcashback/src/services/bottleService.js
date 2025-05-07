// src/services/bottleService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bottles';

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export const fetchUserPoints = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/user-points/${email}`);
    return response.data.totalPoints;
  } catch (error) {
    console.error('Error fetching user points:', error);
    throw error;
  }
};