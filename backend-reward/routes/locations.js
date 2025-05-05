const express = require('express');
const router = express.Router();
const Location = require('../models/Location'); // Adjust path if needed

// GET locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST location
router.post('/locations', async (req, res) => {
  const { name, latitude, longitude } = req.body;

  try {
    const newLocation = new Location({ name, latitude, longitude });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save location' });
  }
});

module.exports = router;
