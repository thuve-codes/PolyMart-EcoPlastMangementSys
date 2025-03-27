// controllers/dbController.js

// Sample function that queries the database for user details by email
const getUserByEmail = async (email) => {
    // Assuming you're using a database like MongoDB, MySQL, or PostgreSQL
    // You'll replace this with actual database querying logic
    
    // For example (MongoDB):
    // const user = await User.findOne({ email });
  
    // Simulating a database response for demonstration
    const usersDatabase = [
      { email: 'test@example.com', name: 'John Doe', age: 25 },
      { email: 'jane@example.com', name: 'Jane Smith', age: 28 },
    ];
    
    // Find user by email (simulation)
    return usersDatabase.find(user => user.email === email);
  };
  
  module.exports = { getUserByEmail };  // Export the function to be used in routes
  
  const PickupRequest = require('./models/PickupRequest'); // Assuming you have a PickupRequest model

// Fetch pickup requests by email and current date
const getPickupRequestsByEmailAndDate = async (email, currentDate) => {
  try {
    return await PickupRequest.find({
      email: email,
      date: { $gte: currentDate }, // Filtering by current date or after
    }).exec();
  } catch (error) {
    throw new Error('Error fetching pickup requests: ' + error);
  }
};

module.exports = { getPickupRequestsByEmailAndDate };
