const express = require('express');
const router = express.Router();
const Chat = require('../models/chatModel');

// POST request to send a message (User to Seller)
router.post('/chat/send', async (req, res) => {
  const { productName, sellerName, text, sender } = req.body;

  if (!productName || !sellerName || !text || !sender) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let chat = await Chat.findOne({ productName, sellerName });

    if (!chat) {
      chat = new Chat({ productName, sellerName, messages: [] });
    }

    chat.messages.push({
      text,
      sender // use the username sent from frontend
    });

    await chat.save();

    res.status(200).json({ message: "Message sent!", chat });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET messages for a product/seller filtered by sender (username)
router.get('/chat/:productName/:sellerName', async (req, res) => {
  const { productName, sellerName } = req.params;
  const { username } = req.query; // frontend should send ?username=thuverakanT

  try {
    const chat = await Chat.findOne({ productName, sellerName });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Filter messages if username is provided
    let messages = chat.messages;
    if (username) {
      messages = messages.filter(
        msg => msg.sender === username || msg.sender === sellerName
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
