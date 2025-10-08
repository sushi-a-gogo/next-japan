import express from "express";
import * as aiController from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/ai/generate-haiku
router.get("/generate-haiku", authMiddleware, aiController.generateHaiku);

// POST /api/ai/generate-content
router.post("/generate-content", authMiddleware, aiController.generateContent);

export default router;
