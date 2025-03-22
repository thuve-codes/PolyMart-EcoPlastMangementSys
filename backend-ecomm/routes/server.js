import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Chat from "./models/chatModel.js"; // Ensure the correct path

dotenv.config(); // ✅ Load environment variables at the top

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*", // Allow all origins (for development)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ API to send a message (User to Seller)
app.post("/api/chat/send", async (req, res) => {
  console.log("Request received at /api/chat/send"); // Debugging log
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
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API to fetch messages for a product's chat
app.get("/api/chat/:productName/:sellerName", async (req, res) => {
  const { productName, sellerName } = req.params;

  try {
    const chat = await Chat.findOne({ productName, sellerName });
    res.status(200).json(chat ? chat.messages : []);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
