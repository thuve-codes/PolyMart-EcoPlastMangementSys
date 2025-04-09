const express = require('express');
const router = express.Router();
const {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  getRequestStats
} = require('../controllers/requestController');
const { protect, authorize, verified } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const PlasticRequest = require('../models/PlasticRequest');

// Include other resource routers
const chatRouter = require('./chatRoutes');

// Re-route into other resource routers
router.use('/:requestId/chats', chatRouter);

router
  .route('/')
  .get(
    protect,
    advancedResults(PlasticRequest, {
      path: 'user processedBy',
      select: 'name email'
    }),
    getRequests
  )
  .post(protect, verified, createRequest);

router
  .route('/:id')
  .get(protect, getRequest)
  .put(protect, authorize('admin'), updateRequest);

router
  .route('/stats')
  .get(protect, authorize('admin'), getRequestStats);

module.exports = router;