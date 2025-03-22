const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/connectDatabase');

// Import your new chat route
const chatRoutes = require('./routes/chat'); // Add this line

// Load environment variables from config.env file
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });   

// Import existing routes
const products = require('./routes/product');
const orders = require('./routes/order');

// Connect to the database
connectDatabase();

app.use(express.json());
app.use(cors()); // Middleware for handling cross-origin requests

// Use existing routes
app.use('/api/v1/', products);
app.use('/api/v1/', orders);

// Use the new chat route
app.use('/api/v1', chatRoutes); // This will handle the chat routes

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
