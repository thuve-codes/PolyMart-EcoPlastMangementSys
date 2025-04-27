const express = require('express');
const app = express();
const dotenv = require('dotenv');
const stripe = require('stripe');  // Changed from import
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/connectDatabase');


// Import your new chat route
const chatRoutes = require('./routes/chat'); // Add this line

// Load environment variables from config.env file
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });   


// Initialize Stripe
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

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


// Create Payment Intent Endpoint
app.post("/api/v1/payment", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Number(amount), // Amount in smallest currency unit (e.g., paise for INR)
      currency: currency || "lkr", 
      payment_method_types: ["card"], // Accept cards
      description: "Payment for Polymart order", // Optional
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
