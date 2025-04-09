const Chat = require('../models/Chat');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all chats
// @route   GET /api/chats
// @access  Private/Admin
exports.getChats = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single chat
// @route   GET /api/chats/:id
// @access  Private/Admin
exports.getChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id).populate('user', 'name email');

  if (!chat) {
    return next(
      new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: chat,
  });
});

// @desc    Add message to chat
// @route   POST /api/chats/:id/messages
// @access  Private/Admin
exports.addMessage = asyncHandler(async (req, res, next) => {
  const { sender, text } = req.body;

  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(
      new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404)
    );
  }

  chat.messages.push({ sender, text });
  await chat.save();

  res.status(200).json({
    success: true,
    data: chat,
  });
});