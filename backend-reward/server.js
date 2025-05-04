const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const leaderboardRoutes = require("./routes/leaderboard");
const chatbotRoutes = require("./routes/chatbot"); // Import the chatbot routes
const welcomeBonusRoutes = require("./routes/welcomeBonus");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Continue running the server even if MongoDB connection fails
    console.log("Server will continue running without database connection");
  });

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/chatbot", chatbotRoutes); // Use the chatbot routes
app.use("/api/welcome-bonus", welcomeBonusRoutes); // Use the welcome bonus routes

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
