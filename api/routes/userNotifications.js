import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import EventOpportunity from "../models/EventOpportunity.js";
import User from "../models/User.js";
import UserNotification, {
  formatNotification,
} from "../models/UserNotification.js";

dotenv.config();
const router = express.Router();

// GET notifications for a specific userId
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Validate user exists
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const notifications = await UserNotification.find({
      userId,
      pending: false,
    })
      .populate({
        path: "opportunityId",
        select: "startDate endDate timeZone timeZoneAbbreviation",
        populate: [
          {
            path: "eventId",
            select:
              "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
          },
        ],
      })
      .lean();

    if (!notifications.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formattedNotifications = notifications.map(formatNotification);
    res.status(200).json({ success: true, data: formattedNotifications });
  } catch (error) {
    console.error("Error fetching user notifications:", error.message || error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// POST new notification
router.post("/", async (req, res) => {
  try {
    const { userId, title, message, opportunityId } = req.body;

    // Input validation
    if (!userId || !title || !message || !opportunityId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate userId and opportunityId format
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(opportunityId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid userId or opportunityId format" });
    }

    // Validate user and opportunity exist
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const opportunity = await EventOpportunity.findOne({
      _id: new mongoose.Types.ObjectId(opportunityId),
    });
    if (!opportunity) {
      return res.status(400).json({ error: "Invalid opportunityId" });
    }

    const notification = new UserNotification({
      userId,
      opportunityId,
      title,
      message,
    });
    const savedVal = await notification.save();

    res
      .status(201)
      .json({ success: true, data: { notificationId: savedVal._id } });
  } catch (error) {
    console.error("Save notification error:", error.message || error);
    res.status(500).json({ error: "Failed to save notification" });
  }
});

// GET notification
router.get("/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Validate notificationId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: "Invalid notificationId format" });
    }
    const notification = await UserNotification.findById(notificationId)
      .populate({
        path: "opportunityId",
        select: "startDate endDate timeZone timeZoneAbbreviation", // Include eventId
        populate: [
          {
            path: "eventId",
            select:
              "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
          },
        ],
      })
      .lean();

    if (!notification)
      return res.status(404).json({ error: "User notification not found" });

    const formattedNotification = formatNotification(notification);
    res.status(200).json({ success: true, data: formattedNotification });
  } catch (error) {
    console.error("Get notification error:", error.message || error);
    res.status(500).json({ error: "Failed to get notification" });
  }
});

// PUT update notification
router.put("/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId, title, message, opportunityId } = req.body;

    // Validate notificationId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: "Invalid notificationId format" });
    }

    // Input validation
    if (!userId || !title || !message || !opportunityId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({ error: "Invalid opportunityId format" });
    }

    const opportunity = await EventOpportunity.findOne({
      _id: new mongoose.Types.ObjectId(opportunityId),
    });
    if (!opportunity) {
      return res.status(400).json({ error: "Invalid opportunityId" });
    }

    // Update notification
    const updateData = { userId, opportunityId, title, message };
    const savedVal = await UserNotification.findByIdAndUpdate(
      notificationId,
      updateData,
      { new: true }
    );
    if (!savedVal) {
      return res.status(404).json({ error: "User notification not found" });
    }

    res
      .status(200)
      .json({ success: true, data: { notificationId: savedVal._id } });
  } catch (error) {
    console.error("Update notification error:", error.message || error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// DELETE notification(s)
// - DELETE /notifications/:notificationId?userId=...
//   → deletes a single notification
// - DELETE /notifications/all?userId=...
//   → deletes ALL notifications for the user
router.delete("/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.query; // required for "all"

    if (notificationId === "all") {
      // Clear all notifications for a user
      if (!userId) {
        return res.status(400).json({ error: "userId query param required" });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
      }

      const result = await UserNotification.deleteMany({ userId });

      return res.status(200).json({
        success: true,
        data: {
          userId,
          deletedCount: result.deletedCount,
        },
      });
    }

    // Otherwise: delete a single notification
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: "Invalid notificationId format" });
    }

    const result = await UserNotification.findByIdAndDelete(notificationId);
    if (!result) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      data: { notificationId: result._id },
    });
  } catch (error) {
    console.error("Delete notification(s) error:", error.message || error);
    res.status(500).json({ error: "Failed to delete notification(s)" });
  }
});

export default router;
