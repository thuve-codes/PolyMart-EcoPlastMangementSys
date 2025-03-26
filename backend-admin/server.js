import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import connectDB from "./config.js"; // Import your DB config
import plasticRequestRoutes from "./Routes/plasticRequestRoutes.js"; // Import routes

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/requests", plasticRequestRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
