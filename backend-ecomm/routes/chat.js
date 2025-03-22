const express = require('express');
const router = express.Router();
const Chat = require('../models/chatModel'); // Make sure the path is correct

// POST request to send a message (User to Seller)
router.post('/chat/send', async (req, res) => {
  const { productName, sellerName, text } = req.body;

  if (!productName || !sellerName || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let chat = await Chat.findOne({ productName, sellerName });

    if (!chat) {
      chat = new Chat({ productName, sellerName, messages: [] });
    }

    chat.messages.push({ text, sender: "User" });
    await chat.save();

    res.status(200).json({ message: "Message sent!", chat });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET request to fetch messages for a product's chat
router.get('/chat/:productName/:sellerName', async (req, res) => {
  const { productName, sellerName } = req.params;

  try {
    const chat = await Chat.findOne({ productName, sellerName });
    res.status(200).json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
