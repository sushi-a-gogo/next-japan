import {
  countEventLikes,
  countEventShares,
  isEventLikedByUser,
  updateEventLikeCount,
  updateEventShareCount,
} from "../services/eventSocialService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";

export const likeEvent = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { userId, eventId, liked } = req.body;
  const likeCount = await updateEventLikeCount(userId, eventId, liked);
  res.json({ success: true, data: { likeCount: likeCount } });
});

export const getEventLikeCount = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const likeCount = await countEventLikes(eventId);
  res.json({ success: true, data: { likeCount } });
});

export const likedByUser = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.params;
  const liked = await isEventLikedByUser(userId, eventId);
  res.json({ success: true, data: { likedByUser: !!liked } });
});

export const shareEvent = asyncHandler(async (req, res) => {
  const { userId, eventId } = req.body;
  const shareCount = await updateEventShareCount(userId, eventId);
  res.json({ success: true, data: { shareCount: shareCount } });
});

export const getEventShareCount = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const shareCount = await countEventShares(eventId);
  res.json({ success: true, data: { shareCount: shareCount } });
});
