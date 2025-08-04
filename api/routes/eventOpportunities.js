import express from "express";
import EventOpportunity from "../models/EventOpportunity.js"; // Adjust path
const router = express.Router();

// GET all event opportunities
router.get("/", async (req, res) => {
  try {
    const documents = await EventOpportunity.find().lean();
    const opportunities = documents.map((item) => ({
      opportunityId: item._id.toString(),
      ...item,
    }));
    res.json({ opportunities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by opportunityId
router.get("/:opportunityId", async (req, res) => {
  try {
    const opportunity = await EventOpportunity.findById(
      req.params.opportunityId
    ).populate("eventId");
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });
    res.json({ opportunity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET event opportunities
router.get("/:eventId/opportunities", async (req, res) => {
  try {
    const documents = await EventOpportunity.find({
      eventId: req.params.eventId,
    }).lean();
    const eventOpportunities = documents.map((item) => ({
      opportunityId: item._id.toString(),
      ...item,
    }));
    res.json({ eventOpportunities });
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

export default router;
