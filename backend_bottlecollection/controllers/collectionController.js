const Bottle = require('../models/Bottle');

// Get pickup requests for a specific email
exports.getPickupRequestsByEmail = async (req, res) => {
  try {
      const { email } = req.params; // Extract email from the request params
      console.log("Received email for fetching pickup requests:", email);  // Log the email for verification

      // Get the current date in the format YYYY-MM-DD
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);  // Set the time to 00:00:00.000 to only compare the date

      // Fetch all bottles for the given email, regardless of status
      const pickupRequests = await Bottle.find({
          email: email,
          createdAt: { $gte: currentDate } // Only pickup requests created today
      });

      console.log("Fetched pickup requests:", pickupRequests);  // Log the fetched pickup requests

      // Add a scheduled time (6 hours after creation) and send the response
      const updatedRequests = pickupRequests.map(request => {
          let scheduledTime = new Date(request.createdAt);
          scheduledTime.setHours(scheduledTime.getHours() + 6); // Add 6 hours to the creation time
          request.scheduledTime = scheduledTime;

          return request;
      });

      res.status(200).json(updatedRequests); // Return the updated pickup requests
  } catch (error) {
      console.error('Error fetching pickup requests:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

// Schedule a pickup for a specific bottle and email
exports.schedulePickup = async (req, res) => {
  try {
    const bottleId = req.params.id;
    const { email } = req.body; // Assuming the email is sent in the request body

    // Find the bottle by ID and user email
    const bottle = await Bottle.findOne({ _id: bottleId, email: email });
    if (!bottle) {
      return res.status(404).json({ message: 'Bottle not found or does not belong to this user' });
    }

    // Set status to 'Scheduled'
    bottle.status = 'Scheduled';

    // Calculate the scheduled time (6 hours from the creation date)
    let scheduledTime = new Date(bottle.createdAt);
    scheduledTime.setHours(scheduledTime.getHours() + 6); // Add 6 hours
    bottle.scheduledTime = scheduledTime;

    // Save the updated bottle
    await bottle.save();

    res.status(200).json({ message: 'Pickup scheduled successfully', bottle });
  } catch (error) {
    console.error('Error scheduling pickup:', error);
    res.status(500).json({ message: 'Error scheduling pickup', error: error.message });
  }
};
