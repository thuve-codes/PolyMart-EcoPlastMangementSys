const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bottleRoutes = require("./routes/bottleRoutes");
const collectionRoutes = require('./routes/collectionRoutes');
const nodemailer = require("nodemailer");
const statusRoutes = require('./routes/StatusRoutes');

const pickupRoutes = require('./routes/pickups');
const locationsRouter = require('./routes/locations');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const recyclerRoutes = require('./routes/recyclerRoutes');
app.use('/api', userRoutes);

app.use("/api", bottleRoutes);
app.use("/api/bottle", bottleRoutes); 
app.use("/api/recycler", recyclerRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api', locationsRouter);

// Create a transporter for sending emails using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail", // Or use another email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env file
    pass: process.env.EMAIL_PASS, // Your email app password from .env file
  },
});

// Endpoint to handle email sending
app.post("/api/send-email", (req, res) => {
  const { email, name, redeemPoints } = req.body;

  // Create the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: email, // Recipient's email (from form data)
    subject: "Plastic Bottle Collection Form Submission",
    text: `Dear ${name},\n\nThank you for submitting your plastic bottle collection form. Awesome! You’ve gained redeemPoints points! Spend them on sustainable, eco-friendly products.\n\nBest regards,\nPlastic Bottle Collection Team`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error); // Log the error
      return res.status(500).json({ message: "Error sending email", errorDetails: error }); // Send the error response
    }
    console.log("Email sent:", info.response); // Log the email provider's response
    res.status(200).json({ message: "Email sent successfully", info: info.response }); // Send success response
  });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));