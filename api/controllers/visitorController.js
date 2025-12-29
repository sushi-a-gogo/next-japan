// controllers/visitorController.js
import * as visitorService from "../services/visitorService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const trackVisit = asyncHandler(async (req, res) => {
  await visitorService.trackVisit(req.body, req); // pass req for headers
  res.status(204).send(); // No Content — perfect for tracking beacons
});
