const express = require('express');
const {
  getChats,
  getChat,
  addMessage,
  searchChats,
} = require('../controllers/chatController');

const router = express.Router();

router
  .route('/')
  .get(getChats)
  .post(addMessage);

router
  .route('/:id')
  .get(getChat);

router
  .route('/search')
  .get(searchChats);

module.exports = router;