import * as eventSocial from "../services/eventSocialService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";

// POST like by user
export const likeEvent = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { userId, eventId, liked } = req.body;
  const likeCount = await eventSocial.updateEventLikeCount(
    userId,
    eventId,
    liked
  );
  res.json({ success: true, data: { likeCount: likeCount } });
});

// GET event likes count
export const getEventLikeCount = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const likeCount = await eventSocial.countEventLikes(eventId);
  res.json({ success: true, data: { likeCount } });
});

// GET is event liked by user
export const likedByUser = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const { userId, eventId } = req.params;
  const liked = await eventSocial.isEventLikedByUser(userId, eventId);
  res.json({ success: true, data: { likedByUser: !!liked } });
});

// POST share event
export const shareEvent = asyncHandler(async (req, res) => {
  const { userId, eventId } = req.body;
  const shareCount = await eventSocial.updateEventShareCount(userId, eventId);
  res.json({ success: true, data: { shareCount: shareCount } });
});

// GET event shares count
export const getEventShareCount = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const shareCount = await eventSocial.countEventShares(eventId);
  res.json({ success: true, data: { shareCount: shareCount } });
});
