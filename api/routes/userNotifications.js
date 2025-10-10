import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotification,
  getUserNotifications,
  updateNotification,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/user/:userId", authMiddleware, getUserNotifications);
router.post("/", authMiddleware, createNotification);
router.get("/:notificationId", getNotification);
router.put("/:notificationId", authMiddleware, updateNotification);
router.delete("/:notificationId", authMiddleware, deleteNotification);

export default router;
