const express = require('express');
const router = express.Router();
const {
  getRequests,
  getRequest,
  createRequest,
  updateRequest, deleteRequest,
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
    // protect,
    // advancedResults(PlasticRequest, {
    //   path: 'user processedBy',
    //   select: 'name email'
    // }),
    getRequests
  )
  .post(createRequest);

router
  .route('/:id')
  .get(getRequest)
  .put(updateRequest)
  .delete(deleteRequest);

// router
//   .route('/stats')
//   .get(protect, authorize('admin'), getRequestStats);

module.exports = router;