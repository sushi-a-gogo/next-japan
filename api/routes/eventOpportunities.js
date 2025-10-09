import express from "express";
import * as eventOpportunityController from "../controllers/eventOpportunityController.js";

const router = express.Router();

// GET all event opportunities
router.get("/", eventOpportunityController.getOpportunities);
// GET by opportunityId
router.get("/:opportunityId", eventOpportunityController.getOpportunityById);
// GET event opportunities
router.get(
  "/:eventId/opportunities",
  eventOpportunityController.getEventOpportunities
);

export default router;
