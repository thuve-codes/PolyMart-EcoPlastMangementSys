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



// Delete a bottle request
exports.deleteBottleRequest = async (req, res) => {
    try {
        await Bottle.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
