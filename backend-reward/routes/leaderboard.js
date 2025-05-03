const express = require("express");
const router = express.Router();
const Bottle = require("../models/Bottle");

// Get all entries
router.get("/", async (req, res) => {
  try {
    const data = await Bottle.find().sort({ points: -1 });
    res.json(data);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add new entry
router.post("/", async (req, res) => {
  try {
    const newEntry = new Bottle(req.body);
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    console.error("Error adding entry:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update entry
router.put("/:id", async (req, res) => {
  try {
    const updated = await Bottle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete entry
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Bottle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
