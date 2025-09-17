import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Event from "../models/Event.js";
import Like from "../models/Like.js";
import { authorized } from "../utils/authHelpers.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { userId, eventId, liked } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ error: "Missing userId or eventId" });
  }

  try {
    if (!authorized(req, res)) {
      return;
    }

    await Like.updateOne(
      { userId, eventId },
      { liked, createdAt: new Date() },
      { upsert: true }
    );
    const likeCount = await Like.countDocuments({ eventId, liked: true });
    await Event.updateOne({ _id: eventId }, { likeCount });
    return res.json({ success: true, data: { likeCount } });
  } catch (error) {
    console.error("Error logging like:", error);
    return res.status(500).json({ error: "Failed to log like" });
  }
});

router.get("/count/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const likeCount = await Like.countDocuments({ eventId, liked: true });
    return res.json({ success: true, data: { likeCount } });
  } catch (error) {
    console.error("Error fetching like count:", error);
    return res.status(500).json({ error: "Failed to fetch like count" });
  }
});

router.get("/:eventId/user/:userId", authMiddleware, async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    if (!authorized(req, res, true)) {
      return;
    }

    const like = await Like.findOne({ eventId, userId, liked: true });
    return res.json({ success: true, data: { liked: !!like } });
  } catch (error) {
    console.error("Error checking like:", error);
    return res.status(500).json({ error: "Failed to check like" });
  }
});

export default router;
