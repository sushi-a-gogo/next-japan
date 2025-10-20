import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./index.js";
import notificationPoller from "./services/notificationPoller.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB().catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  notificationPoller();
});
