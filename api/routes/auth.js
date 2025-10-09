import express from "express";
import {
  getUser,
  login,
  logout,
  refreshUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/user", getUser);
router.post("/refresh", refreshUser);
router.post("/logout", logout);

export default router;
