// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// Middleware
app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.get('/', (req, res) => res.send("API working good"));

// Handle form submission (inserting into MongoDB)
app.post('/submitForm', async (req, res) => {
  const formData = req.body;

  try {
    
    console.log('Form Data Received:', formData);
    // Create a new form entry and save it to MongoDB
    const newForm = new Form(formData);
    await newForm.save();


    res.status(200).json({
      message: 'Form submitted successfully!',
      data: newForm,
    });
  } catch (error) {
    // Log the full error to help with debugging
    console.error('Error submitting form:', error.message);
    console.error(error.stack);

    res.status(500).json({
      message: 'Failed to submit form.',
      error: error.message,  // Include error message for better debugging
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
