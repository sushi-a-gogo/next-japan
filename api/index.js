import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import eventRouter from "./routes/event.js";
import imageResizeRouter from "./routes/image-resize.js";
import openAiRouter from "./routes/openai-integration.js";
import organizationRouter from "./routes/organization.js";
import userRouter from "./routes/user.js";

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

// Mount routers
app.use("/api/organization", organizationRouter);
app.use("/api/event", eventRouter);
app.use("/api/image", imageResizeRouter);
app.use("/api/user", userRouter);

app.use("/api/ai", apiLimiter);
app.use("/api/ai", openAiRouter);

app.get("/api/ping", (req, res) => {
  res.json({ msg: "API is alive" });
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

export default app;
export { app };
