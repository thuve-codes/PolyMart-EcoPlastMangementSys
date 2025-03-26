const express = require("express");
const Leaderboard = require("../models/Leaderboard");
const router = express.Router();

// Get all leaderboard entries
router.get("/", async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find();
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new leaderboard entry
router.post("/", async (req, res) => {
  try {
    const newEntry = new Leaderboard(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a leaderboard entry
router.put("/:id", async (req, res) => {
  try {
    const updatedEntry = await Leaderboard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a leaderboard entry
router.delete("/:id", async (req, res) => {
  try {
    await Leaderboard.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
