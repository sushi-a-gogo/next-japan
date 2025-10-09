import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";

export const getUsers = asyncHandler(async (req, res) => {
  res.json({ success: true, data: {} });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;
  res.json({ success: true, data: {} });
});

export const getUserRewards = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;
  res.json({ success: true, data: {} });
});

export const createUser = asyncHandler(async (req, res) => {
  res.json({ success: true, data: {} });
});

export const updateUser = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;
  res.json({ success: true, data: {} });
});
