const express = require('express');
const {
  getChats,
  getChat,
  addMessage,
} = require('../controllers/chatController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getChats);

router
  .route('/:id')
  .get(protect, authorize('admin'), getChat);

router
  .route('/:id/messages')
  .post(protect, authorize('admin'), addMessage);

module.exports = router;