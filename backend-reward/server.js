const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const leaderboardRoutes = require("./routes/leaderboardRoutes");
const chatbotRoute = require('./routes/chatbot'); // ✅ move require here

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use leaderboard routes
app.use("/leaderboard", leaderboardRoutes);

app.use('/api/chatbot', chatbotRoute); // ✅ now this works

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
