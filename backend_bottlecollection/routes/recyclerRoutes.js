const express = require("express");
const router = express.Router();
const recyclerController = require("../controllers/recyclerController");

router.get("/pickup-requests", recyclerController.fetchPickupRequests);
router.get("/recycling-history", recyclerController.fetchRecyclingHistory);

// Update a recent activity
router.put("/update-recent-activity/:id", recyclerController.updateRecentActivity);

// Delete a recent activity
router.delete("/delete-recent-activity/:id", recyclerController.deleteRecentActivity);


// Fetch Recent Activities (Today)
router.get("/recent-activities", recyclerController.fetchRecentActivities);

module.exports = router;
