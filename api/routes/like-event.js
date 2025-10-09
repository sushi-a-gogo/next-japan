import express from "express";
import {
  getEventLikeCount,
  likedByUser,
  likeEvent,
} from "../controllers/eventSocialController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, likeEvent);
router.get("/count/:eventId", getEventLikeCount);
router.get("/:eventId/user/:userId", authMiddleware, likedByUser);

export default router;
