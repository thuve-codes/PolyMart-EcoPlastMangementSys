const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rank: { type: String, required: true },
  plasticRecycled: { type: Number, required: true },
  rewardPoints: { type: Number, required: true },
  redemptionStatus: { type: String, required: true },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;
