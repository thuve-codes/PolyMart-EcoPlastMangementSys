const express = require('express');
const router = express.Router();
const { getBottleById, updateStatus } = require('../controllers/pickupController');

// Route to fetch bottle details by ID
router.get('/:id', getBottleById);

// Route to update the status of a bottle pickup
router.put('/:id/status', updateStatus);

module.exports = router;
