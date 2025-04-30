const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Save a location
router.post('/locations', async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const newLocation = new Location({ name, latitude, longitude });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch all locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
