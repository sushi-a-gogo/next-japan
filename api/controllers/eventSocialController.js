import * as eventSocialService from "../services/eventSocialService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authorized } from "../utils/authHelpers.js";

// POST like by user
export const likeEvent = asyncHandler(async (req, res) => {
  if (!authorized(req, res)) return;

  const { userId, eventId, liked } = req.body;
  const likeCount = await eventSocialService.updateEventLikeCount(
    userId,
    eventId,
    liked
  );
  res.json({ success: true, data: { likeCount: likeCount } });
});

// GET event likes count
export const getEventLikeCount = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const likeCount = await eventSocialService.countEventLikes(eventId);
  res.json({ success: true, data: { likeCount } });
});

// GET is event liked by user
export const likedByUser = asyncHandler(async (req, res) => {
  if (!authorized(req, res, true)) return;

  const { userId, eventId } = req.params;
  const liked = await eventSocialService.isEventLikedByUser(userId, eventId);
  res.json({ success: true, data: { likedByUser: !!liked } });
});

// POST share event
export const shareEvent = asyncHandler(async (req, res) => {
  const { userId, eventId } = req.body;
  const shareCount = await eventSocialService.updateEventShareCount(
    userId,
    eventId
  );
  res.json({ success: true, data: { shareCount: shareCount } });
});

// GET event shares count
export const getEventShareCount = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const shareCount = await eventSocialService.countEventShares(eventId);
  res.json({ success: true, data: { shareCount: shareCount } });
});
