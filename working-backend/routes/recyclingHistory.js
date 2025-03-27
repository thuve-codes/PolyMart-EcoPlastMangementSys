const express = require('express');
const router = express.Router();
const Bottle = require('../models/Bottle');  // Adjust path to where your Bottle model is located

// API route to get recycling history for a specific user
router.get('/recycling-history/:email', async (req, res) => {

  try {
    const userEmail = req.params.email;
    const recyclingHistory = await Bottle.find({ email: userEmail }).sort({ pickupDate: -1 });  // Sort by pickupDate in descending order

    if (!recyclingHistory || recyclingHistory.length === 0) {
        return res.status(404).json({ message: 'No recycling history found.' });
      }
  
      res.json(recyclingHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching recycling history.' });
    }
  });
  
  module.exports = router;