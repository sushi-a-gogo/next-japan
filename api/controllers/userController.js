import {
  findUserById,
  findUserByIdAndUpdate,
  findUserRewards,
  getAllUsers,
  saveUser,
} from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";
import { NotFoundError } from "../utils/errors.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.json({ success: true, data: users });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const user = await findUserById(req.params.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({ success: true, data: user });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await saveUser(req.body);
  res.status(201).json({
    success: true,
    data: {
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      isEmailPreferred: user.isEmailPreferred,
    },
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const user = await findUserByIdAndUpdate(req.body);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ success: true, data: user });
});

export const getUserRewards = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const rewards = await findUserRewards(req.params.userId);
  res.json({ success: true, data: rewards || [] });
});
