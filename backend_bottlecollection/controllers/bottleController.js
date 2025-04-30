const Bottle = require("../models/Bottle");

// Create new bottle collection request
exports.createBottleRequest = async (req, res) => {
    try {
        const bottleRequest = new Bottle(req.body);
        await bottleRequest.save();
        res.status(201).json({ message: "Bottle collection request submitted!", bottleRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all bottle collection requests
exports.getBottleRequests = async (req, res) => {
    try {
        const bottleRequests = await Bottle.find();
        res.status(200).json(bottleRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the most recent bottle collection request for a specific email
exports.getBottleRequestByEmail = async (req, res) => {
    try {
        const { email } = req.params;  // Extract email from the request params
        const bottleRequest = await Bottle.findOne({ email }).sort({ createdAt: -1 });  // Sort by createdAt to get the latest record

        if (!bottleRequest) {
            return res.status(404).json({ message: "No request found for this email" });
        }

        res.status(200).json(bottleRequest);  // Return the latest bottle request associated with the email
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update the most recent bottle collection request for a specific email
exports.updateBottleRequest = async (req, res) => {
    try {
        const { email } = req.body;  // Extract email from the request body

        // Find the most recent request for this email and update it
        const updatedBottleRequest = await Bottle.findOneAndUpdate(
            { email },  // Search for the request using the email
            { ...req.body },  // Update with the new data from the request body
            { sort: { createdAt: -1 }, new: true }  // Sort by createdAt and return the updated document
        );

        if (!updatedBottleRequest) {
            return res.status(404).json({ message: "No request found for this email" });
        }

        res.status(200).json({ message: "Request updated successfully", updatedBottleRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete the most recent bottle collection request for a specific email
exports.deleteBottleRequest = async (req, res) => {
    try {
        const { email } = req.body;  // Extract email from the request body

        // Find the most recent request for this email and delete it
        const deletedBottleRequest = await Bottle.findOneAndDelete(
            { email },  // Find the most recent request for this email
            { sort: { createdAt: -1 } }  // Sort by createdAt to target the most recent request
        );

        if (!deletedBottleRequest) {
            return res.status(404).json({ message: "No request found for this email" });
        }

        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Fetch all bottles by email
exports.getBottlesByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const bottles = await Bottle.find({ email: email });
    res.status(200).json(bottles);
  } catch (error) {
    console.error("Error fetching bottles by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};


{/*// Fetch scheduled bottles by email
exports.getScheduledBottlesByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const scheduledBottles = await Bottle.find({ email: email, status: 'Scheduled' });
    res.status(200).json(scheduledBottles);
  } catch (error) {
    console.error("Error fetching scheduled bottles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 */}

{/*
// Get all recycling history records for a specific email
exports.getRecyclingHistory = async (req, res) => {
    try {
        const { email } = req.query;
        console.log("Fetching recycling history for:", email); // ✅ Debug line

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const recyclingHistory = await Bottle.find({ email }).sort({ createdAt: -1 });
        console.log("Found records:", recyclingHistory.length); // ✅ Debug line

        if (recyclingHistory.length === 0) {
            return res.status(404).json({ message: "No recycling history found for this email" });
        }

        res.status(200).json(recyclingHistory);
    } catch (error) {
        console.error("Error in getRecyclingHistory:", error);
        res.status(500).json({ error: error.message });
    }
}; */}
//new methods for retrieving the info in recycler dashboard
// Fetch all bottles by email
{/*exports.getBottlesByEmail = async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      const bottles = await Bottle.find({ email: email });
      res.status(200).json(bottles);
    } catch (error) {
      console.error("Error fetching bottles by email:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Fetch scheduled bottles by email
  exports.getScheduledBottlesByEmail = async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      const scheduledBottles = await Bottle.find({ email: email, status: 'Scheduled' });
      res.status(200).json(scheduledBottles);
    } catch (error) {
      console.error("Error fetching scheduled bottles:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Fetch recycling history by email
 // Fetch all recycling history records for a specific email
exports.getRecyclingHistory = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const recyclingHistory = await Bottle.find({ email }).sort({ createdAt: -1 });

        if (recyclingHistory.length === 0) {
            return res.status(404).json({ message: "No recycling history found for this email" });
        }

        res.status(200).json(recyclingHistory);
    } catch (error) {
        console.error("Error in getRecyclingHistory:", error);
        res.status(500).json({ error: error.message });
    }
};

  

 */}