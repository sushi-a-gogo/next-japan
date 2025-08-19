import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import EventOpportunity from "../models/EventOpportunity.js";
import EventRegistration, {
  formatRegistration,
} from "../models/EventRegistration.js";
import User from "../models/User.js";
import UserNotification from "../models/UserNotification.js";

dotenv.config();
const router = express.Router();

// GET registrations for a specific userId
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

    const registrations = await EventRegistration.find({ userId })
      .populate({
        path: "opportunityId",
        select:
          "locationId startDate endDate timeZone timeZoneAbbreviation timeZoneOffset notes", // Include eventId
        populate: [
          {
            path: "eventId",
            select:
              "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
          },
          {
            path: "locationId",
            select:
              "locationName addressLine1 city state zip latitude longitude",
          },
        ],
      })
      .lean();

    if (!registrations.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formattedRegistrations = registrations.map(formatRegistration);
    res.status(200).json({ success: true, data: formattedRegistrations });
  } catch (error) {
    console.error("Error fetching user registrations:", error.message || error);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

/**
 * POST /registrations
 *
 * Simulates a user registering for an event.
 * - Creates a new EventRegistration with status "requested".
 * - Sends a user notification that the registration has been received.
 * - Schedules a pending notification for registration approval (delivered later by poller).
 */
router.post("/", async (req, res) => {
  try {
    const { userId, status, opportunityId } = req.body;

    // --- VALIDATIONS ---
    if (!userId || !status || !opportunityId)
      return res.status(400).json({ error: "Missing required fields" });

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(opportunityId)
    )
      return res
        .status(400)
        .json({ error: "Invalid userId or opportunityId format" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const opportunity = await EventOpportunity.findById(opportunityId);
    if (!opportunity)
      return res.status(400).json({ error: "Invalid opportunityId" });

    if (!["requested", "registered", "cancelled"].includes(status))
      return res.status(400).json({ error: "Invalid status value" });

    // --- SAVE REGISTRATION ---
    const registration = new EventRegistration({
      userId,
      opportunityId,
      status,
    });
    const savedReg = await registration.save();

    // --- CREATE IMMEDIATE NOTIFICATION ---
    await UserNotification.create({
      userId,
      opportunityId,
      registrationId: savedReg._id.toString(),
      title: "We have received your registration request!",
      message:
        "Thanks for registering! Your request is in progress, and we're working to get you a spot.",
      sendAt: new Date(),
      pending: false,
    });

    // --- SCHEDULE FOLLOW-UP NOTIFICATION 10-20 MINUTES LATER ---
    const followUpMinutes = Math.floor(Math.random() * 11) + 10; // 10–20 minutes
    const sendAt = new Date(Date.now() + followUpMinutes * 60_000);

    await UserNotification.create({
      userId,
      opportunityId,
      registrationId: savedReg._id.toString(),
      title: "Your request was approved!",
      message:
        "Your registration has been confirmed. We look forward to seeing you at the event!",
      sendAt,
      pending: true,
    });

    res
      .status(201)
      .json({ success: true, data: { registrationId: savedReg._id } });
  } catch (error) {
    console.error("Save registration error:", error.message || error);
    res.status(500).json({ error: "Failed to save registration" });
  }
});

// GET registration
router.get("/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;

    // Validate registrationId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ error: "Invalid registrationId format" });
    }
    const registration = await EventRegistration.findById(registrationId)
      .populate({
        path: "opportunityId",
        select:
          "locationId startDate endDate timeZone timeZoneAbbreviation timeZoneOffset notes", // Include eventId
        populate: [
          {
            path: "eventId",
            select:
              "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
          },
          {
            path: "locationId",
            select:
              "locationName addressLine1 city state zip latitude longitude",
          },
        ],
      })
      .lean();

    if (!registration)
      return res.status(404).json({ error: "Event registration not found" });

    const formattedRegistration = formatRegistration(registration);
    res.status(200).json({ success: true, data: formattedRegistration });
  } catch (error) {
    console.error("Get registration error:", error.message || error);
    res.status(500).json({ error: "Failed to get registration" });
  }
});

// PUT update registration (primarily for status)
router.put("/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { userId, status, opportunityId } = req.body;

    // Validate registrationId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ error: "Invalid registrationId format" });
    }

    // Validate required fields
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Validate status
    if (!["requested", "registered", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Validate optional fields
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    if (userId) {
      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
    }
    if (opportunityId && !mongoose.Types.ObjectId.isValid(opportunityId)) {
      return res.status(400).json({ error: "Invalid opportunityId format" });
    }
    if (opportunityId) {
      const opportunity = await EventOpportunity.findOne({
        _id: new mongoose.Types.ObjectId(opportunityId),
      });
      if (!opportunity) {
        return res.status(400).json({ error: "Invalid opportunityId" });
      }
    }

    // Update registration
    const updateData = { status };
    if (userId) updateData.userId = userId;
    if (opportunityId) updateData.opportunityId = opportunityId;

    const savedReg = await EventRegistration.findByIdAndUpdate(
      registrationId,
      updateData,
      { new: true }
    );
    if (!savedReg) {
      return res.status(404).json({ error: "Event Registration not found" });
    }

    res
      .status(200)
      .json({ success: true, data: { registrationId: savedReg._id } });
  } catch (error) {
    console.error("Update registration error:", error.message || error);
    res.status(500).json({ error: "Failed to update registration" });
  }
});

/**
 * DELETE /registrations/:registrationId
 *
 * Cancels an event registration.
 * - Deletes the EventRegistration.
 * - Immediately creates a cancellation notification.
 */
router.delete("/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;

    // Validate registrationId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ error: "Invalid registrationId format" });
    }

    const result = await EventRegistration.findByIdAndDelete(registrationId);
    if (!result) {
      return res.status(404).json({ error: "Event Registration not found" });
    }

    // --- CREATE IMMEDIATE NOTIFICATION ---
    await UserNotification.create({
      userId: result.userId,
      opportunityId: result.opportunityId,
      title: "Registration Cancelled",
      message: "Your event registration has been cancelled.",
      sendAt: new Date(),
      pending: false,
    });

    res
      .status(200)
      .json({ success: true, data: { registrationId: result._id } });
  } catch (error) {
    console.error("Delete registration error:", error.message || error);
    res.status(500).json({ error: "Failed to delete registration" });
  }
});

export default router;
