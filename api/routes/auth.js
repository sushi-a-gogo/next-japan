import express from "express";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUser(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const accessToken = generateAccessToken(user.userId, user.email);
    // set access token as httpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    const refreshToken = generateRefreshToken(user.userId, user.email);
    // set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax", // switch to "none" for dev/localhost
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// auth/user
router.get("/user", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(200).json({ success: false, data: null });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await findUser(payload.email);
    if (!user) {
      return res.status(200).json({ success: false, data: null });
    }

    // refresh the access token
    const newAccessToken = generateAccessToken(user.userId, user.email);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(200).json({ success: false, data: null });
  }
});

// refresh route
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await findUser(payload.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const newAccessToken = generateAccessToken(user.userId, user.email);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    console.error("Verify failed " + err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/auth" });
  return res.json({ success: true, message: "Logged out" });
});

const findUser = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
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

  return formattedUser;
};

export default router;
