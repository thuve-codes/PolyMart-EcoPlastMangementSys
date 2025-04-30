const Bottle = require('../models/Bottle');

// Controller function to fetch bottle data by ID
const getBottleById = async (req, res) => {
  try {
    const bottle = await Bottle.findById(req.params.id);
    if (!bottle) {
      return res.status(404).json({ message: "Bottle not found" });
    }
    res.json(bottle);
  } catch (error) {
    console.error('Error fetching bottle data:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update the status of a pickup
const updateStatus = async (req, res) => {
    try {
      const { id } = req.params; 
      const { status } = req.body;
  
      // Updated valid statuses
      const validStatuses = ['Picked Up', 'Completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      const updatedBottle = await Bottle.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedBottle) {
        return res.status(404).json({ message: "Bottle not found" });
      }
  
      res.json(updatedBottle);
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = { getBottleById, updateStatus };
