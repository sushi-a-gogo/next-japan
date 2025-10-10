import * as eventOpportunityService from "../services/eventOpportunityService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../utils/errors.js";

// GET all opportunities
export const getOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await eventOpportunityService.getOpportunities();
  res.status(200).json({ success: true, data: opportunities });
});

// GET opportunity by id
export const getOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await eventOpportunityService.getOpportunityById(
    req.params.opportunityId
  );
  if (!opportunity) throw new NotFoundError("Event Opportunity not found");

  res.status(200).json({ success: true, data: opportunity });
});

// GET event-specific opportunities
export const getEventOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await eventOpportunityService.getEventOpportunities(
    req.params.eventId
  );
  res.status(200).json({ success: true, data: opportunities });
});
