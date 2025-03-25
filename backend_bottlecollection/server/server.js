import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// Middleware
app.use(cors({ credentials: true})); 
app.use(bodyParser.json()); 
app.use(express.json()); 
app.use(cookieParser());

//API Endpoints
app.get('/',(req,res)=>res.send("API working good"));
app.use('/api/auth', authRouter)

// Handle form submission
app.post('/submitForm', (req, res) => {
  const formData = req.body;
  
  // Validate incoming data (ensure required fields are provided)
  if (!formData.name || !formData.email || !formData.contactNumber || !formData.bottleType || !formData.weight || !formData.address || !formData.bottleType || !formData.weight || !formData.disposalPurpose || !formData.pickupDate) {
    return res.status(400).json({
      message: 'Missing required fields.',
      missingFields: ['name', 'email', 'contactNumber'].filter(field => !formData[field]),
    });
  }
  app.post('/submit-form', (req, res) => {
    const formData = req.body;

    console.log('Received form data:', formData);
   
    res.json({ message: 'Form submitted successfully!', points: formData.points });
});
  console.log('Form Data Received:', formData);

  // Calculate points based on bottle type and weight
  
  /*const points = calculatePoints(formData.weight, formData.bottleType);*/

//
app.post('/submit-form', (req, res) => {
  const formData = req.body;

  // Create a new Form document using the formData
  const newForm = new Form(formData);

  // Save the form data to the database
  newForm.save()
      .then(() => {
          // Respond with a success message and points earned
          res.json({ message: 'Form submitted successfully!', points: formData.points });
      })
      .catch((error) => {
          // Handle errors and send a response with status 500
          res.status(500).json({ message: 'Error saving form data', error });
      });
});
//


  // Respond back with the processed data
  res.status(200).json({
    message: 'Form submitted successfully!',
    /*data: formData,
    points: points,*/
  });
});

// Function to calculate points based on weight and bottle type
/*
const calculatePoints = (weight, bottleType) => {
  let pointsPerKg = 0;

  switch (bottleType) {
    case "plastic":
      pointsPerKg = 2;
      break;
    case "glass":
      pointsPerKg = 3;
      break;
    case "metal":
      pointsPerKg = 4;
      break;
    case "other":
      pointsPerKg = 1;
      break;
    default:
      pointsPerKg = 0;
  }

  return weight ? parseFloat(weight) * pointsPerKg : 0;
};*/

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
