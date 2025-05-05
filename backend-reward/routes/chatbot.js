const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

router.post('/', async (req, res) => {
  const { messages } = req.body;
  const prompt = messages[messages.length - 1].content;

  

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'AI could not generate a response.';

    res.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: answer
          }
        }
      ]
    });
  } catch (error) {
    console.error('🔥 Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get AI response from Gemini' });
  }
});

module.exports = router;
