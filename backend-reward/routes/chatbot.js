// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// const dotenv = require('dotenv');
// dotenv.config(); // Load environment variables

// // POST route to send prompt to Gemini API
// router.post('/', async (req, res) => {
//   try {
//     const { messages } = req.body;

//     if (!messages || !Array.isArray(messages) || messages.length === 0) {
//       return res.status(400).json({ error: 'Invalid or missing "messages" array in request body.' });
//     }

//     const prompt = messages[messages.length - 1]?.content;

//     if (!prompt) {
//       return res.status(400).json({ error: 'Prompt content is missing in the last message.' });
//     }

//     const geminiResponse = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: 'user',
//             parts: [{ text: prompt }]
//           }
//         ]
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const answer = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     res.json({
//       choices: [
//         {
//           message: {
//             role: 'assistant',
//             content: answer || 'AI could not generate a response.'
//           }
//         }
//       ]
//     });
//   } catch (error) {
//     console.error('🔥 Gemini API error:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to get AI response from Gemini.' });
//   }
// });

// module.exports = router;





const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// POST /chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid "messages" array' });
    }

    // Validate each message has role and content
    for (const message of messages) {
      if (!message.role || !message.content) {
        return res.status(400).json({ error: 'Each message must have "role" and "content" properties' });
      }
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1:free',
        messages: messages,
      },
      {
        headers: {
<<<<<<< HEAD
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`,
=======
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || 'your-default-key'}`,
>>>>>>> refs/remotes/origin/dev
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5004', // Required by OpenRouter
          'X-Title': 'Your App Name' // Required by OpenRouter
        }
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || 'No reply from DeepSeek.';

    res.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: reply
          }
        }
      ]
    });
  } catch (error) {
    console.error('❌ DeepSeek API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get response from DeepSeek API',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;