import * as aiService from "../services/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";

// GET ai-generated haiku
export const generateHaiku = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const haiku = await aiService.fetchHaiku();
  res.json({
    success: true,
    data: haiku,
  });
});

// POST ai-event content generation
export const generateContent = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { promptParams } = req.body;
  if (!promptParams) {
    return res.status(400).json({ error: "Missing promptParams" });
  }

  try {
    const content = await aiService.fetchGeneratedContent(promptParams);
    res.json({ success: true, data: content });
  } catch {
    throw new AppError("Invalid response from AI Provider.");
  }
});
