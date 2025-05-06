require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const requestRoutes = require('./routes/requestRoutes');
const chatRoutes = require('./routes/chatRoutes');
const productRoutes = require('./routes/productRoutes');
const Chat = require('./models/Chat'); // Import the Chat model

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/products', productRoutes);

// Error Handling Middleware
// const errorHandler = require('./middleware/errorHandler');
// app.use(errorHandler);


//Message by duver

// Get all chats for a user (filtered by sellerName or sender in messages)
app.get('/api/chats', async (req, res) => {
  try {
    const { user } = req.query; // User can be sellerName or sender in messages
    if (!user) {
      return res.status(400).json({ message: 'User query parameter is required' });
    }

    const chats = await Chat.find({
      $or: [
        { sellerName: user },
        { 'messages.sender': user },
      ],
    }).sort({ 'messages.date': -1 });

    // Transform chats to match frontend structure
    const formattedChats = chats.map((chat) => ({
      id: chat._id,
      productName: chat.productName,
      sellerName: chat.sellerName,
      from: chat.messages[chat.messages.length - 1]?.sender || chat.sellerName,
      subject: `Re: ${chat.productName}`,
      date: chat.messages[chat.messages.length - 1]?.date.toISOString() || new Date().toISOString(),
      read: true, // Simplified; you can add logic to track read status
      messages: chat.messages,
    }));

    res.json(formattedChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific chat by ID
app.get('/api/chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Format response to match frontend expectations
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

    res.json(formattedChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new chat or add a message to an existing chat
app.post('/api/chats', async (req, res) => {
  try {
    const { productName, sellerName, sender, text } = req.body;

    if (!productName || !sellerName || !sender || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if a chat already exists for this product and seller
    let chat = await Chat.findOne({ productName, sellerName });

    if (chat) {
      // Add new message to existing chat
      chat.messages.push({
        sender,
        text,
        date: new Date(),
      });
      await chat.save();
    } else {
      // Create new chat
      chat = new Chat({
        productName,
        sellerName,
        messages: [{ sender, text, date: new Date() }],
      });
      await chat.save();
    }

    // Format response
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

    res.status(201).json(formattedChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search chats by productName or sender
app.get('/api/chats/search', async (req, res) => {
  try {
    const { query, user } = req.query;
    if (!query || !user) {
      return res.status(400).json({ message: 'Query and user parameters are required' });
    }

    const chats = await Chat.find({
      $and: [
        {
          $or: [
            { sellerName: user },
            { 'messages.sender': user },
          ],
        },
        {
          $or: [
            { productName: { $regex: query, $options: 'i' } },
            { 'messages.sender': { $regex: query, $options: 'i' } },
          ],
        },
      ],
    }).sort({ 'messages.date': -1 });

    const formattedChats = chats.map((chat) => ({
      id: chat._id,
      productName: chat.productName,
      sellerName: chat.sellerName,
      from: chat.messages[chat.messages.length - 1]?.sender || chat.sellerName,
      subject: `Re: ${chat.productName}`,
      date: chat.messages[chat.messages.length - 1]?.date.toISOString() || new Date().toISOString(),
      read: true, // Simplified
      messages: chat.messages,
    }));

    res.json(formattedChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//End message-duver

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});