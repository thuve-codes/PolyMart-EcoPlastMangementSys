// routes/pickupRoutes.js
const express = require('express');
const Bottle = require('./models/bottle');  // Import the Bottle model
const router = express.Router();

// Get all pickup requests (bottles)
router.get('/api/available-pickups', async (req, res) => {
  try {
    const pickups = await Bottle.find();  // Fetch all pickups from the Bottle collection
    res.json(pickups);  // Send the data back as JSON
  } catch (error) {
    console.error('Error fetching pickups:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
