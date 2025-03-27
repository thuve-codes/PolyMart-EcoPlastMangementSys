import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Ensure that DB_URL is set in the environment variables
    if (!process.env.DB_URL) {
      throw new Error('DB_URL is not defined in the environment variables');
    }

    mongoose.connection.once('connected', () => {
      console.log("Database Connected");
    });

    // Connect to the MongoDB database
    await mongoose.connect(`${process.env.DB_URL}/mern-auth`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
