// api/config/db.js
import mongoose from "mongoose";

let isConnected = false;

// Retry connection with exponential backoff
const connectWithRetry = async (retries = 5, delay = 2000) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    if (retries === 0) {
      console.error("Failed to connect to MongoDB after retries:", error);
      if (!isConnected) {
        console.log("Shutting down due to DB failure...");
        process.exit(1); // Render will restart
      }
    }
    console.warn(`Retrying MongoDB connection (${retries} attempts left)...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectWithRetry(retries - 1, delay * 2);
  }
};

const connectDB = async () => {
  if (!isConnected) {
    await connectWithRetry();
  }
};

export default connectDB;
