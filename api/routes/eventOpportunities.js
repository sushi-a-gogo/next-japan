import express from "express";
import * as eventOpportunityController from "../controllers/eventOpportunityController.js";

const router = express.Router();

router.get("/", eventOpportunityController.getOpportunities);
router.get("/:opportunityId", eventOpportunityController.getOpportunityById);
router.get(
  "/:eventId/opportunities",
  eventOpportunityController.getEventOpportunities
);

export default router;
