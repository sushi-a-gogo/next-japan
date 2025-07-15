import express from "express";
import EventOpportunity from "../models/EventOpportunity.js"; // Adjust path
const router = express.Router();

// GET all event opportunities
router.get("/", async (req, res) => {
  try {
    const opportunities = await EventOpportunity.find().populate("eventId");
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new event opportunity
router.post("/", async (req, res) => {
  try {
    const opportunity = new EventOpportunity(req.body);
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET by opportunityId
router.get("/:opportunityId", async (req, res) => {
  try {
    const opportunity = await EventOpportunity.findOne({
      opportunityId: req.params.opportunityId,
    }).populate("eventId");
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
