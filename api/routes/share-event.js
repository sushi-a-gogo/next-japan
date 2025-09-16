import express from "express";
import Event from "../models/Event.js";
import Share from "../models/Share.js";
import { authorized } from "../utils/authHelpers.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ error: "Missing userId or eventId" });
  }

  try {
    if (!authorized(req, res)) {
      return;
    }

    await Share.updateOne(
      { userId, eventId },
      { shared: true, createdAt: new Date() },
      { upsert: true }
    );
    const shareCount = await Share.countDocuments({ eventId, shared: true });
    await Event.updateOne({ _id: eventId }, { shareCount });
    return res.json({ success: true, data: { shareCount } });
  } catch (error) {
    console.error("Error logging share:", error);
    return res.status(500).json({ error: "Failed to log share" });
  }
});

router.get("/count/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const shareCount = await Share.countDocuments({ eventId, shared: true });
    return res.json({ success: true, data: { shareCount } });
  } catch (error) {
    console.error("Error fetching share count:", error);
    return res.status(500).json({ error: "Failed to fetch share count" });
  }
});

export default router;
