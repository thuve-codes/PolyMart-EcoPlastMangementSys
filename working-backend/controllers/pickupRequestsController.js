const express = require('express');
const router = express.Router();
const { getPickupRequestsByEmailAndDate } = require('./dbController'); // Assuming you have a dbController to interact with your database

// Endpoint to get pickup requests by email and current date
router.get('/pickup-requests/:email', async (req, res) => {
  const { email } = req.params;
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

  try {
    // Fetch the pickup requests from the database
    const pickupRequests = await getPickupRequestsByEmailAndDate(email, currentDate);
    
    if (pickupRequests.length > 0) {
      res.json(pickupRequests);
    } else {
      res.status(404).json({ message: 'No pickup requests found for this email.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
