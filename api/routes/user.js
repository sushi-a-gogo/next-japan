import dotenv from "dotenv";
import express from "express";

import User from "../models/User.js";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  const formattedUsers = users.map((user) => ({
    userId: user._id.toString(), // Use _id as eventId
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: {
      id: user.imageId,
      cloudflareImageId: user.cloudflareImageId,
      width: user.imageWidth,
      height: user.imageHeight,
    },
    addressLine1: user.addressLine1,
    city: user.city,
    state: user.state,
    zip: user.zip,
    mode: user.mode,
    createdAt: user.createdAt,
  }));

  res.status(200).json({ users: formattedUsers });
});

router.put("/update", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      image,
      addressLine1,
      city,
      state,
      zip,
      mode,
    } = req.body;

    // Input validation
    if (!firstName || !lastName || !email || !image) {
      return res.status(400).json({
        error: "Missing required fields: name, email, or image",
      });
    }

    // Save to MongoDB
    const user = new User({
      firstName,
      lastName,
      email,
      imageId: image.id,
      imageHeight: image.height,
      imageWidth: image.width,
      cloudflareImageId: image.cloudflareImageId,
      addressLine1,
      city,
      state,
      zip,
      mode,
    });

    // You need to find the user by id and then update
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId for update" });
    }

    const savedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        imageId: image.id,
        imageHeight: image.height,
        imageWidth: image.width,
        cloudflareImageId: image.cloudflareImageId,
        addressLine1,
        city,
        state,
        zip,
        mode,
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
        image: {
          id: savedUser.imageId,
          cloudflareImageId: savedUser.cloudflareImageId,
          width: savedUser.imageWidth,
          height: savedUser.imageHeight,
        },
        addressLine1: savedUser.addressLine1,
        city: savedUser.city,
        state: savedUser.state,
        zip: savedUser.zip,
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

    const resp = {
      userId: user._id.toString(), // Use _id as eventId
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: {
        id: user.imageId,
        cloudflareImageId: user.cloudflareImageId,
        width: user.imageWidth,
        height: user.imageHeight,
      },
      addressLine1: user.addressLine1,
      city: user.city,
      state: user.state,
      zip: user.zip,
      mode: user.mode,
      createdAt: user.createdAt,
    };
    res.status(200).json({ user: resp });
  } catch (error) {
    res.status(400).json({ message: "Invalid user id" });
  }
});

export default router;
