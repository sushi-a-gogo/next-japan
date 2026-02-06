import Event from "../models/Event.js";
import Like from "../models/Like.js";
import Share from "../models/Share.js";
import { ValidationError } from "../utils/errors.js";

export const countEventLikes = async (eventId) => {
  if (!eventId) {
    throw new ValidationError("Missing required field 'eventId'");
  }
  const likeCount = await Like.countDocuments({ eventId, liked: true });
  return likeCount;
};

export const updateEventLikeCount = async (userId, eventId, liked) => {
  if (!userId) {
    throw new ValidationError("Missing required field 'userId'");
  }
  if (!eventId) {
    throw new ValidationError("Missing required field 'eventId'");
  }

  const likedAt = new Date();
  await Like.updateOne(
    { userId, eventId },
    {
      $set: { liked, updatedAt: likedAt },
      $setOnInsert: { createdAt: likedAt },
    },
    { upsert: true },
  );

  const likeCount = await Like.countDocuments({ eventId, liked: true });
  await Event.updateOne({ _id: eventId }, { likeCount });
  return likeCount;
};

export const isEventLikedByUser = async (userId, eventId) => {
  if (!userId) {
    throw new ValidationError("Missing required field 'userId'");
  }
  if (!eventId) {
    throw new ValidationError("Missing required field 'eventId'");
  }

  const like = await Like.findOne({ eventId, userId, liked: true });
  return !!like;
};

export const countEventShares = async (eventId) => {
  if (!eventId) {
    throw new ValidationError("Missing required fields");
  }

  const shareCount = await Share.countDocuments({ eventId, shared: true });
  return shareCount;
};

export const updateEventShareCount = async (userId, eventId) => {
  if (!userId || !eventId) {
    throw new ValidationError("Missing required fields");
  }

  await Share.updateOne(
    { userId, eventId },
    { shared: true, createdAt: new Date() },
    { upsert: true },
  );
  const shareCount = await Share.countDocuments({ eventId, shared: true });
  await Event.updateOne({ _id: eventId }, { shareCount });
  return shareCount;
};
