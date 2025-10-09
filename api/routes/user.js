// routes/user.js
import express from "express";
import {
  createUser,
  getUserProfile,
  getUserRewards,
  getUsers,
  updateUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Public endpoint to get all users
router.get("/", getUsers);

// Public endpoint to create a new user
router.post("/signup", createUser);

// Protected endpoint to update user profile
router.put("/update", authMiddleware, updateUserProfile);

// Protected endpoint to get user profile by ID
router.get("/:userId", authMiddleware, getUserProfile);

// Protected endpoint to get user's rewards
router.get("/:userId/rewards", authMiddleware, getUserRewards);

export default router;
