import express from "express";
import * as userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.put("/update", authMiddleware, userController.updateUserProfile);
router.get("/:userId", authMiddleware, userController.getUserProfile);
router.get("/:userId/rewards", authMiddleware, userController.getUserRewards);

export default router;
