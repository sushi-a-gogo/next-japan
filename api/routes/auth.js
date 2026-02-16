import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", authController.login);
router.get("/user", authController.getUser);
router.post("/refresh", authController.refreshUser);
router.post("/logout", authController.logout);
router.post("/signup", authController.signUpUser);

export default router;
