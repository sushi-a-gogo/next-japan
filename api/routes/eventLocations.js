import express from "express";
import EventLocation from "../models/EventLocation.js";
import EventOpportunity from "../models/EventOpportunity.js"; // Adjust path

const router = express.Router();

// GET all event locations
router.get("/", async (req, res) => {
  try {
    const documents = await EventLocation.find();
    const locations = documents.map((item) => ({
      locationId: item._id.toString(), // Use _id as locationId
      ...item,
    }));
    res.json({ locations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by locationId
router.get("/:locationId", async (req, res) => {
  try {
    const location = await EventLocation.findOne({
      locationId: req.params.locationId,
    }).populate("eventId");
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json({ location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET event locations
router.get("/:eventId/locations", async (req, res) => {
  try {
    // Validate eventId
    if (!req.params.eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Fetch opportunities and populate locationId
    const opportunities = await EventOpportunity.find({
      eventId: req.params.eventId,
    })
      .populate("locationId")
      .lean(); // Populates locationId with EventLocation documents

    // Extract unique locations (locationId is now the full EventLocation document)
    const eventLocations = [
      ...new Set(
        opportunities.map((o) => o.locationId).filter((location) => !!location)
      ),
    ].map((location) => ({
      locationId: location._id.toString(), // Use _id as locationId
      ...location,
    }));

    res.json({ eventLocations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new event location
router.post("/", async (req, res) => {
  try {
    const location = new EventLocation(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
