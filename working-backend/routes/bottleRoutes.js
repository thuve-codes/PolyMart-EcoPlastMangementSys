const express = require("express");
const {
    createBottleRequest,
    getBottleRequests,
    getBottleRequestByEmail,  // Add this to handle requests by email
    updateBottleRequest,      // Add this for updating requests by email
    deleteBottleRequest
  } = require("../controllers/bottleController");


const router = express.Router();

router.post("/bottles", createBottleRequest);

router.get("/bottles", getBottleRequests);

router.get("/bottles/:email", getBottleRequestByEmail); // Fetch bottle request by email

// Update a bottle collection request by email
router.put("/bottles/update", updateBottleRequest); // Update request by email

// Delete a bottle collection request by email
router.delete("/bottles/delete", deleteBottleRequest);

{/*// New routes (for your dashboard fetching)
router.get("/scheduled", getScheduledBottlesByEmail);   // ?email=... required
router.get("/recycling-history", getRecyclingHistory);  // ?email=... required */}

module.exports = router;