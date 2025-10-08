import { fetchGeneratedContent, fetchHaiku } from "../services/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";

export const generateHaiku = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const haiku = await fetchHaiku();
  res.json({
    success: true,
    data: haiku,
  });
});

export const generateContent = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { promptParams } = req.body;
  if (!promptParams) {
    return res.status(400).json({ error: "Missing promptParams" });
  }

  const content = await fetchGeneratedContent(promptParams);
  res.json({ success: true, data: content });
});
