const Chat = require('../models/Chat');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Public
exports.getChats = asyncHandler(async (req, res, next) => {
  const { user } = req.query;

  let query = {};
  if (user) {
    query = {
      $or: [
        { sellerName: user },
        { 'messages.sender': user },
      ],
    };
  }

  const chats = await Chat.find(query).sort({ 'messages.date': -1 });

  const formattedChats = chats.map((chat) => ({
    id: chat._id,
    productName: chat.productName,
    sellerName: chat.sellerName,
    from: chat.messages[chat.messages.length - 1]?.sender || chat.sellerName,
    subject: `Re: ${chat.productName}`,
    date: chat.messages[chat.messages.length - 1]?.date.toISOString() || new Date().toISOString(),
    read: true,
    messages: chat.messages,
  }));

  res.status(200).json({
    success: true,
    data: formattedChats,
  });
});

// @desc    Get single chat
// @route   GET /api/chats/:id
// @access  Public
exports.getChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new ErrorResponse(`Chat not found with id of ${req.params.id}`, 404));
  }

  const formattedChat = {
    id: chat._id,
    productName: chat.productName,
    sellerName: chat.sellerName,
    messages: chat.messages.map((msg) => ({
      sender: msg.sender,
      text: msg.text,
      date: msg.date.toISOString(),
      id: msg._id,
    })),
  };

  res.status(200).json({
    success: true,
    data: formattedChat,
  });
});

// @desc    Add message or create new chat
// @route   POST /api/chats
// @access  Public
exports.addMessage = asyncHandler(async (req, res, next) => {
  const { productName, sellerName, sender, text } = req.body;

  if (!productName || !sellerName || !sender || !text) {
    return next(new ErrorResponse('All fields (productName, sellerName, sender, text) are required', 400));
  }

  let chat = await Chat.findOne({ productName, sellerName });

  if (chat) {
    chat.messages.push({
      sender,
      text,
      date: new Date(),
    });
    await chat.save();
  } else {
    chat = new Chat({
      productName,
      sellerName,
      messages: [{ sender, text, date: new Date() }],
    });
    await chat.save();
  }

  const formattedChat = {
    id: chat._id,
    productName: chat.productName,
    sellerName: chat.sellerName,
    from: sender,
    subject: `Re: ${chat.productName}`,
    date: chat.messages[chat.messages.length - 1].date.toISOString(),
    read: false,
    messages: chat.messages,
  };

  res.status(201).json({
    success: true,
    data: formattedChat,
  });
});

// @desc    Search chats by productName or sender
// @route   GET /api/chats/search
// @access  Public
exports.searchChats = asyncHandler(async (req, res, next) => {
  const { query, user } = req.query;
  if (!query) {
    return next(new ErrorResponse('Query parameter is required', 400));
  }

  let searchQuery = {
    $or: [
      { productName: { $regex: query, $options: 'i' } },
      { 'messages.sender': { $regex: query, $options: 'i' } },
    ],
  };

  if (user) {
    searchQuery = {
      $and: [
        {
          $or: [
            { sellerName: user },
            { 'messages.sender': user },
          ],
        },
        searchQuery,
      ],
    };
  }

  const chats = await Chat.find(searchQuery).sort({ 'messages.date': -1 });

  const formattedChats = chats.map((chat) => ({
    id: chat._id,
    productName: chat.productName,
    sellerName: chat.sellerName,
    from: chat.messages[chat.messages.length - 1]?.sender || chat.sellerName,
    subject: `Re: ${chat.productName}`,
    date: chat.messages[chat.messages.length - 1]?.date.toISOString() || new Date().toISOString(),
    read: true,
    messages: chat.messages,
  }));

  res.status(200).json({
    success: true,
    data: formattedChats,
  });
});