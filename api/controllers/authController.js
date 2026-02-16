import * as authService from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
};

const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
};

// POST login user
export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(
    req.body,
  );

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.json({ success: true, data: { user, accessToken } });
});

// GET user
export const getUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(200).json({ success: false, data: null });
  }

  const { newAccessToken, newRefreshToken, user } =
    await authService.fetchUser(refreshToken);
  res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);
  return res.json({
    success: true,
    data: { user, accessToken: newAccessToken },
  });
});

// POST refresh user
export const refreshUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, data: null, message: "No refresh token" });
  }

  const { newAccessToken, newRefreshToken, user } =
    await authService.fetchUser(refreshToken);

  res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);
  return res.json({
    success: true,
    data: { user, accessToken: newAccessToken },
  });
});

// POST new user
export const createUser = asyncHandler(async (req, res) => {
  const user = await authService.createUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// POST logout user
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);
  return res.json({ success: true, data: null, message: "Logged out" });
});
