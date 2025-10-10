import * as authService from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

const accessCookieOptions = {
  ...cookieOptions,
  path: "/",
  maxAge: 60 * 60 * 1000, // 1 hour
};

const refreshCookieOptions = {
  ...cookieOptions,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
};

// POST login user
export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(
    req.body
  );

  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.json({ success: true, data: { user } });
});

// GET user
export const getUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(200).json({ success: false, data: null });
  }

  const { newAccessToken, user } = await authService.fetchUser(refreshToken);
  res.cookie("accessToken", newAccessToken, accessCookieOptions);

  return res.json({ success: true, data: { user } });
});

// POST refresh user
export const refreshUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, data: null, message: "No refresh token" });
  }

  const { newAccessToken, user } = await authService.fetchUser(refreshToken);
  res.cookie("accessToken", newAccessToken, accessCookieOptions);

  return res.json({ success: true, data: { user } });
});

// POST logout user
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/auth" });

  return res.json({ success: true, data: null, message: "Logged out" });
});
