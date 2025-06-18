import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests. Please try again later.",
  },
});

import eventRouter from "./event.js";
import imageResizeRouter from "./image-resize.js";
import openAiRouter from "./openai-integration.js";
import organizationRouter from "./organization.js";
import userRouter from "./user.js";

const app = express();
dotenv.config();

app.use(express.static("public"));
app.use(express.json()); // Parse JSON bodies

// CORS
app.use(
  cors({
    origin: process.env.ANGULAR_APP_URI, // Set in .env file
  })
);

// Mount the organization router
app.use("/api/organization", organizationRouter);
// Mount the event router
app.use("/api/event", eventRouter);
// Mount the image resize router
app.use("/api/image", imageResizeRouter);
// Mount the user router
app.use("/api/user", userRouter);

// Mount the OpenAI router
app.use("/api/ai", openAiRouter);
app.use("/api/ai", apiLimiter); // Apply only to routes starting with /api/ai

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
