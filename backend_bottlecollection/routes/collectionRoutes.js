const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/collectionController');

// Route to get all bottles ready for pickup for a specific email
router.get('/pickup-requests/:email', CollectionController.getPickupRequestsByEmail);

// Route to schedule a bottle pickup by id and email
router.post('/schedule-pickup/:id', CollectionController.schedulePickup);

module.exports = router;
