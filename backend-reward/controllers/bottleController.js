// backend/controllers/bottleController.js
import Bottle from '../models/Bottle.js';

// Get top 3 users for leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Bottle.aggregate([
      {
        $group: {
          _id: "$email",
          name: { $first: "$name" },
          totalPoints: { $sum: "$points" }
        }
      },
      { $sort: { totalPoints: -1 } }, // Sort by points descending
      { $limit: 3 }, // Only get top 3
      {
        $project: {
          _id: 0,
          email: "$_id",
          name: 1,
          points: "$totalPoints"
        }
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user's total points
export const getUserPoints = async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await Bottle.aggregate([
      { $match: { email } },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: "$points" }
        }
      }
    ]);

    const totalPoints = result.length > 0 ? result[0].totalPoints : 0;
    res.status(200).json({ totalPoints });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ message: 'Server error' });
  }
};