import { findEvents } from "../services/eventSearchService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchEvents = asyncHandler(async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const results = await findEvents(query);
  res.status(200).json({ success: true, data: results });
});
