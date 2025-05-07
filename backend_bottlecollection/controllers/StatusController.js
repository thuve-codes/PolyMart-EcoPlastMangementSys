const Bottle = require('../models/Bottle');

// Get all pickup requests filtered by user email and today's date
exports.getAllPickupRequests = async (req, res) => {
    try {
        const { email } = req.query;  // Get the email from query params
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to midnight to compare only the date

        // Get the next day's start time (just after midnight)
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Fetch pickup requests that match today's date and the user's email
        const pickups = await Bottle.find({
            email: email,
            pickupDate: {
                $gte: today,  // Pickup requests on or after today
                $lt: tomorrow  // Pickup requests before tomorrow (i.e., only today's requests)
            }
        });

        // If no pickups found, return a message
        if (pickups.length === 0) {
            return res.status(404).json({ message: 'No pickup requests for today' });
        }

        res.status(200).json(pickups); // Return filtered pickups
    } catch (error) {
        console.error('Error fetching pickup requests:', error);
        res.status(500).json({ message: 'Server Error while fetching pickup requests' });
    }
};
