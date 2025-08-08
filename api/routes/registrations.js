import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import EventOpportunity from "../models/EventOpportunity.js";
import EventRegistration from "../models/EventRegistration.js";
import User from "../models/User.js";

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
      return res.status(200).json({ registrations: [] }); // Your fix
    }

    const formattedRegistrations = registrations.map((reg) => ({
      registrationId: reg._id.toString(),
      userId: reg.userId,
      status: reg.status,
      opportunity: reg.opportunityId
        ? {
            opportunityId: reg.opportunityId._id.toString(),
            eventId: reg.opportunityId.eventId?._id.toString(), // Add eventId (string from EventOpportunity)
            startDate: reg.opportunityId.startDate,
            endDate: reg.opportunityId.endDate,
            timeZone: reg.opportunityId.timeZone,
            timeZoneAbbreviation: reg.opportunityId.timeZoneAbbreviation,
            timeZoneOffset: reg.opportunityId.timeZoneOffset,
            notes: reg.opportunityId.notes,
          }
        : null,
      eventTitle: reg.opportunityId?.eventId?.eventTitle || null,
      location: reg.opportunityId?.locationId
        ? {
            locationName: reg.opportunityId.locationId.locationName,
            addressLine1: reg.opportunityId.locationId.addressLine1,
            city: reg.opportunityId.locationId.city,
            state: reg.opportunityId.locationId.state,
            zip: reg.opportunityId.locationId.zip,
            latitude: reg.opportunityId.locationId.latitude,
            longitude: reg.opportunityId.locationId.longitude,
          }
        : null,
      image: reg.opportunityId?.eventId
        ? {
            id: reg.opportunityId.eventId.imageId,
            cloudflareImageId: reg.opportunityId.eventId.cloudflareImageId,
            width: reg.opportunityId.eventId.imageWidth,
            height: reg.opportunityId.eventId.imageHeight,
          }
        : null,
      createdAt: reg.createdAt,
    }));

    res.status(200).json({ registrations: formattedRegistrations });
  } catch (error) {
    console.error("Error fetching user registrations:", error.message || error);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});
// POST new registration
router.post("/", async (req, res) => {
  try {
    const { userId, status, opportunityId } = req.body;

    // Input validation
    if (!userId || !status || !opportunityId) {
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

    // Validate status
    if (!["requested", "registered", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const registration = new EventRegistration({
      userId,
      opportunityId,
      status,
    });
    const savedReg = await registration.save();

    // Populate response
    // const populatedReg = await EventRegistration.findById(savedReg._id)
    //   .populate({
    //     path: "opportunityId",
    //     populate: [
    //       {
    //         path: "eventId",
    //         select:
    //           "eventTitle imageId cloudflareImageId imageWidth imageHeight",
    //       },
    //       {
    //         path: "locationId",
    //         select:
    //           "locationName addressLine1 city state zip latitude longitude",
    //       },
    //     ],
    //   })
    //   .lean();

    // const formattedReg = {
    //   registrationId: populatedReg._id.toString(),
    //   userId: populatedReg.userId,
    //   status: populatedReg.status,
    //   opportunity: populatedReg.opportunityId
    //     ? {
    //         opportunityId: populatedReg.opportunityId._id.toString(),
    //         startDate: populatedReg.opportunityId.startDate,
    //         endDate: populatedReg.opportunityId.endDate,
    //         timeZone: populatedReg.opportunityId.timeZone,
    //         timeZoneAbbreviation:
    //           populatedReg.opportunityId.timeZoneAbbreviation,
    //         timeZoneOffset: populatedReg.opportunityId.timeZoneOffset,
    //         notes: populatedReg.opportunityId.notes,
    //       }
    //     : null,
    //   eventTitle: populatedReg.opportunityId?.eventId?.eventTitle || null,
    //   location: populatedReg.opportunityId?.locationId
    //     ? {
    //         locationName: populatedReg.opportunityId.locationId.locationName,
    //         addressLine1: populatedReg.opportunityId.locationId.addressLine1,
    //         city: populatedReg.opportunityId.locationId.city,
    //         state: populatedReg.opportunityId.locationId.state,
    //         zip: populatedReg.opportunityId.locationId.zip,
    //         latitude: populatedReg.opportunityId.locationId.latitude,
    //         longitude: populatedReg.opportunityId.locationId.longitude,
    //       }
    //     : null,
    //   image: populatedReg.opportunityId?.eventId
    //     ? {
    //         id: populatedReg.opportunityId.eventId.imageId,
    //         cloudflareImageId:
    //           populatedReg.opportunityId.eventId.cloudflareImageId,
    //         width: populatedReg.opportunityId.eventId.imageWidth,
    //         height: populatedReg.opportunityId.eventId.imageHeight,
    //       }
    //     : null,
    //   createdAt: populatedReg.createdAt,
    // };

    res
      .status(201)
      .json({ success: true, data: { registrationId: savedReg._id } });
  } catch (error) {
    console.error("Save registration error:", error.message || error);
    res
      .status(500)
      .json({ success: false, error: "Failed to save registration" });
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
    // .populate({
    //   path: "opportunityId",
    //   populate: [
    //     {
    //       path: "eventId",
    //       select:
    //         "eventTitle imageId cloudflareImageId imageWidth imageHeight",
    //     },
    //     {
    //       path: "locationId",
    //       select:
    //         "locationName addressLine1 city state zip latitude longitude",
    //     },
    //   ],
    // })
    // .lean();

    if (!savedReg) {
      return res.status(404).json({ error: "Event Registration not found" });
    }

    // const formattedReg = {
    //   registrationId: savedReg._id.toString(),
    //   userId: savedReg.userId,
    //   status: savedReg.status,
    //   opportunity: savedReg.opportunityId
    //     ? {
    //         opportunityId: savedReg.opportunityId._id.toString(),
    //         startDate: savedReg.opportunityId.startDate,
    //         endDate: savedReg.opportunityId.endDate,
    //         timeZone: savedReg.opportunityId.timeZone,
    //         timeZoneAbbreviation: savedReg.opportunityId.timeZoneAbbreviation,
    //         timeZoneOffset: savedReg.opportunityId.timeZoneOffset,
    //         notes: savedReg.opportunityId.notes,
    //       }
    //     : null,
    //   eventTitle: savedReg.opportunityId?.eventId?.eventTitle || null,
    //   location: savedReg.opportunityId?.locationId
    //     ? {
    //         locationName: savedReg.opportunityId.locationId.locationName,
    //         addressLine1: savedReg.opportunityId.locationId.addressLine1,
    //         city: savedReg.opportunityId.locationId.city,
    //         state: savedReg.opportunityId.locationId.state,
    //         zip: savedReg.opportunityId.locationId.zip,
    //         latitude: savedReg.opportunityId.locationId.latitude,
    //         longitude: savedReg.opportunityId.locationId.longitude,
    //       }
    //     : null,
    //   image: savedReg.opportunityId?.eventId
    //     ? {
    //         id: savedReg.opportunityId.eventId.imageId,
    //         cloudflareImageId: savedReg.opportunityId.eventId.cloudflareImageId,
    //         width: savedReg.opportunityId.eventId.imageWidth,
    //         height: savedReg.opportunityId.eventId.imageHeight,
    //       }
    //     : null,
    //   createdAt: savedReg.createdAt,
    // };

    res
      .status(200)
      .json({ success: true, data: { registrationId: savedReg._id } });
  } catch (error) {
    console.error("Update registration error:", error.message || error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update registration" });
  }
});

export default router;
