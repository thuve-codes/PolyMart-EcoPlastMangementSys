const Bottle = require("../models/Bottle");

// Fetch all pickup requests (Available status)
// Fetch all pickup requests (Available status)
exports.fetchPickupRequests = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Email received:', email);  // Debugging log
    const pickups = await Bottle.find({ email, status: "Pending" }).sort({ createdAt: -1 });

    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Fetch recycling history (all pickups by email)
exports.fetchRecyclingHistory = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Email received:', email);
    const history = await Bottle.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Recent Activities (Today)
// Fetch recent activities (Today's activities)
exports.fetchRecentActivities = async (req, res) => {
    try {
      const { email } = req.query;
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // 00:00:00 of today
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // 23:59:59 of today
  
      const recentActivities = await Bottle.find({
        email,
        pickupDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }).sort({ pickupDate: -1 });
  
      res.status(200).json(recentActivities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Update a recent activity
exports.updateRecentActivity = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body; // Receive the updated fields from the frontend
  
      const updatedBottle = await Bottle.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedBottle) {
        return res.status(404).json({ error: "Activity not found" });
      }
  
      res.status(200).json(updatedBottle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a recent activity
  exports.deleteRecentActivity = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedBottle = await Bottle.findByIdAndDelete(id);
  
      if (!deletedBottle) {
        return res.status(404).json({ error: "Activity not found" });
      }
  
      res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  