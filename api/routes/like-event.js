import express from "express";
import * as eventSocialController from "../controllers/eventSocialController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, eventSocialController.likeEvent);
router.get("/count/:eventId", eventSocialController.getEventLikeCount);
router.get(
  "/:eventId/user/:userId",
  authMiddleware,
  eventSocialController.likedByUser
);

export default router;
