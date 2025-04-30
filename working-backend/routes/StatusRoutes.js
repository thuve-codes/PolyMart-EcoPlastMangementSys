const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/StatusController');

// Route to get all pickup requests filtered by email
router.get('/pickup-requests', StatusController.getAllPickupRequests);

module.exports = router;
