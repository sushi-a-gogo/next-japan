import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import { setXsrfCookie, validateXsrf } from "./middleware/xsrf.middleware.js";
import aiRouter from "./routes/ai.js";
import authRouter from "./routes/auth.js";
import eventLocationsRouter from "./routes/eventLocations.js";
import eventOpportunitiesRouter from "./routes/eventOpportunities.js";
import eventRegistrationsRouter from "./routes/eventRegistrations.js";
import eventsRouter from "./routes/events.js";
import eventSearchRouter from "./routes/eventSearch.js";
import imageResizeRouter from "./routes/image-resize.js";
import likeEventRouter from "./routes/like-event.js";
import shareEventRouter from "./routes/share-event.js";
import userRouter from "./routes/user.js";
import notificationRouter from "./routes/userNotifications.js";
import visitorRouter from "./routes/visitor.js";

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
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.ANGULAR_APP_URI, // Set in .env
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
  }),
);

app.use(setXsrfCookie);
app.use("/api", validateXsrf);

// Mount routers
app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter); // MongoDB events
app.use("/api/event-locations", eventLocationsRouter); // MongoDB event locations
app.use("/api/event-opportunities", eventOpportunitiesRouter); // MongoDB event opportunities
app.use("/api/event-registrations", eventRegistrationsRouter);
app.use("/api/search", eventSearchRouter);
app.use("/api/image", imageResizeRouter);
app.use("/api/user", userRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/like-event", likeEventRouter);
app.use("/api/share-event", shareEventRouter);
app.use("/api/visitors", visitorRouter);

app.use("/api/ai", apiLimiter);
app.use("/api/ai", aiRouter);

app.get("/api/ping", (req, res) => {
  console.log("Ping received, instance awake:", new Date());
  res.json({ msg: "API is alive", timestamp: new Date().toISOString() });
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

app.use(errorHandler);

export default app;
