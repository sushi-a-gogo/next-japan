import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import aiRouter from "./routes/ai-integration.js";
import eventRouter from "./routes/event.js";
import eventLocationsRouter from "./routes/eventLocations.js";
import eventOpportunitiesRouter from "./routes/eventOpportunities.js";
import eventsRouter from "./routes/events.js";
import imageResizeRouter from "./routes/image-resize.js";
import organizationRouter from "./routes/organization.js";
import userRouter from "./routes/user.js";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack);
  process.exit(1); // Exits the process, triggering Render restart if needed
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests
  message: {
    status: 429,
    error: "Too many requests. Please try again later.",
  },
});

const app = express();
dotenv.config();
console.log("CORS origin:", process.env.ANGULAR_APP_URI);

app.use(express.json()); // Parse JSON bodies

// CORS
app.use(
  cors({
    origin: process.env.ANGULAR_APP_URI, // Set in .env
  })
);

// Connect to MongoDB
connectDB().catch((err) => console.error("MongoDB connection error:", err));

// Mount routers
app.use("/api/organization", organizationRouter); // JSON app data
app.use("/api/event", eventRouter); // JSON events
app.use("/api/events", eventsRouter); // MongoDB events
app.use("/api/event-locations", eventLocationsRouter); // MongoDB event locations
app.use("/api/event-opportunities", eventOpportunitiesRouter); // MongoDB event opportunities
app.use("/api/image", imageResizeRouter);
app.use("/api/user", userRouter);

app.use("/api/ai", apiLimiter);
app.use("/api/ai", aiRouter);

app.get("/api/ping", (req, res) => {
  console.log("Ping received, instance awake:", new Date());
  res.json({ msg: "API is alive" });
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

export default app;
