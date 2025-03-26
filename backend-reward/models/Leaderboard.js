const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  username: String,
  email: String,
  rank: String,
  plasticRecycled: Number,
  rewardPoints: Number,
  redemptionStatus: String,
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
