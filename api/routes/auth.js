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

    const accessToken = generateAccessToken(
      formattedUser.userId,
      formattedUser.email
    );
    // set access token as httpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const refreshToken = generateRefreshToken(
      formattedUser.userId,
      formattedUser.email
    );
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
        user: formattedUser,
        token: generateAccessToken("--", formattedUser.email),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// refresh route
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken(payload.userId, payload.email);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({
      success: true,
      data: { token: generateAccessToken("--", payload.email) },
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

export default router;
