import * as userService from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";
import { NotFoundError } from "../utils/errors.js";

// GET all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({ success: true, data: users });
});

// GET user by id
export const getUserProfile = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const user = await userService.findUserById(req.params.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({ success: true, data: user });
});

// POST new user
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.saveUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// PUT update user
export const updateUserProfile = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const user = await userService.findUserByIdAndUpdate(req.body);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ success: true, data: user });
});

// GET user rewards
export const getUserRewards = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const rewards = await userService.findUserRewards(req.params.userId);
  res.json({ success: true, data: rewards || [] });
});
