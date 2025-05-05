const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  username: String,
  email: String,
  rank: String,
  plasticRecycled: String,
  rewardPoints: String,
  redemptionStatus: String,
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
