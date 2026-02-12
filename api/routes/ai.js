import express from "express";
import * as aiController from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/generate-haiku", authMiddleware, aiController.generateHaiku);
router.post("/generate-content", authMiddleware, aiController.generateContent);

export default router;
