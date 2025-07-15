import express from "express";
import EventLocation from "../models/EventLocation.js";

const router = express.Router();

// GET all event locations
router.get("/", async (req, res) => {
  try {
    const locations = await EventLocation.find().populate("eventId");
    res.json(locations);
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

// GET by locationId
router.get("/:locationId", async (req, res) => {
  try {
    const location = await EventOpportunity.findOne({
      locationId: req.params.locationId,
    }).populate("eventId");
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
