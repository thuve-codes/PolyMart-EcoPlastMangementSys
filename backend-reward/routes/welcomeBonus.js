const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Grant welcome bonus if not already claimed
router.put("/claim-welcome-bonus/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.welcomeBonusClaimed) {
      user.points = (user.points || 0) + 100;
      user.welcomeBonusClaimed = true;
      await user.save();
      return res.status(200).json({ message: "Welcome bonus granted!", points: user.points });
    } else {
      return res.status(200).json({ message: "Welcome bonus already claimed", points: user.points });
    }
  } catch (err) {
    res.status(500).json({ message: "Error claiming bonus", error: err.message });
  }
});

module.exports = router;
