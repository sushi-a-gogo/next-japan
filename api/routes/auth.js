import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const formattedUser = {
      userId: user._id.toString(), // Use _id as eventId
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      image: {
        id: user.imageId,
        cloudflareImageId: user.cloudflareImageId,
        width: user.imageWidth,
        height: user.imageHeight,
      },
      phone: user.phone,
      isEmailPreferred: user.isEmailPreferred,
      mode: user.mode,
      createdAt: user.createdAt,
    };
    const token = generateToken(formattedUser.userId, formattedUser.email);

    res.json({
      success: true,
      data: {
        user: formattedUser,
        token,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
