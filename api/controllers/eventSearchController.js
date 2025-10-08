import { searchEvents } from "../services/eventSearchService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const queryEvents = asyncHandler(async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const results = await searchEvents(query);
  res.status(200).json({ success: true, data: results });
});
