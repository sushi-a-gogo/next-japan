import dotenv from "dotenv";
import express from "express";

import User from "../models/User.js";
import UserReward from "../models/UserReward.js";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  const formattedUsers = users.map((user) => ({
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
    mode: user.mode,
    createdAt: user.createdAt,
  }));

  res.status(200).json({ success: true, data: formattedUsers });
});

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, subscriptionPlan } = req.body;

    // Input validation
    if (!firstName || !lastName || !email || !subscriptionPlan) {
      return res.status(400).json({
        error: "Missing required fields: name, email, plan",
      });
    }

    // Save to MongoDB
    const user = new User({
      firstName,
      lastName,
      email,
      subscriptionPlan,
      isEmailPreferred: true,
    });
    const savedUser = await user.save();

    return res.status(201).json({
      success: true,
      data: {
        userId: savedUser._id.toString(), // Pass _id as eventId
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        subscriptionPlan: savedUser.subscriptionPlan,
        isEmailPreferred: savedUser.isEmailPreferred,
      },
    });
  } catch (error) {
    console.error("Save user error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to save user",
    });
  }
});

router.put("/update", async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      subscriptionPlan,
      image,
      phone,
      isEmailPreferred,
      mode,
    } = req.body;

    // Input validation
    if (
      !userId ||
      !firstName ||
      !lastName ||
      !email ||
      !image ||
      !subscriptionPlan
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Save to MongoDB
    const savedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        subscriptionPlan,
        imageId: image.id,
        imageHeight: image.height,
        imageWidth: image.width,
        cloudflareImageId: image.cloudflareImageId,
        phone,
        isEmailPreferred,
        mode: mode || null,
      },
      { new: true }
    );
    if (!savedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(201).json({
      success: true,
      data: {
        userId: savedUser._id.toString(), // Pass _id as eventId
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        subscriptionPlan: savedUser.subscriptionPlan,
        image: {
          id: savedUser.imageId,
          cloudflareImageId: savedUser.cloudflareImageId,
          width: savedUser.imageWidth,
          height: savedUser.imageHeight,
        },
        phone: savedUser.phone,
        isEmailPreferred: savedUser.isEmailPreferred,
        mode: savedUser.mode,
      },
    });
  } catch (error) {
    console.error("Save user error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to save user",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

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
    res.status(200).json({ success: true, data: formattedUser });
  } catch (error) {
    res.status(400).json({ message: "Invalid user id" });
  }
});

router.get("/:id/rewards", async (req, res) => {
  try {
    const rewards = await UserReward.find({ userId: req.params.id }).lean();
    if (!rewards) return res.status(200).json({ success: true, data: [] });

    res.status(200).json({ success: true, data: rewards });
  } catch (error) {
    res.status(400).json({ message: "Invalid user id" });
  }
});

export default router;
