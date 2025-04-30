const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../controllers/dbController'); // Importing the controller function

// Define the API endpoint to get user details by email
router.get('/user/:email', async (req, res) => {
  const email = req.params.email;
  
  try {
    // Call the controller function that queries the database for the user by email
    const userDetails = await getUserByEmail(email); 
    
    if (userDetails) {
      res.json(userDetails);  // Return the user details as JSON if the user is found
    } else {
      res.status(404).json({ message: 'User not found' });  // Return a 404 if no user is found
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  // Return a 500 status if there's a server error
  }
});

module.exports = router;  // Export the route