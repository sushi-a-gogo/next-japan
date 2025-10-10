import express from "express";
import * as notificationController from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/user/:userId",
  authMiddleware,
  notificationController.getUserNotifications
);
router.post("/", authMiddleware, notificationController.createNotification);
router.get("/:notificationId", notificationController.getNotification);
router.put(
  "/:notificationId",
  authMiddleware,
  notificationController.updateNotification
);
router.delete(
  "/:notificationId",
  authMiddleware,
  notificationController.deleteNotification
);

export default router;
