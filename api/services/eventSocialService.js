import Event from "../models/Event.js";
import Like from "../models/Like.js";
import Share from "../models/Share.js";

export const countEventLikes = async (eventId) => {
  if (!eventId) {
    throw new ValidationError("Missing required fields");
  }
  const likeCount = await Like.countDocuments({ eventId, liked: true });
  return likeCount;
};

export const updateEventLikeCount = async (userId, eventId, liked) => {
  if (!userId || !eventId) {
    throw new ValidationError("Missing required fields");
  }

  await Like.updateOne(
    { userId, eventId },
    { liked, createdAt: new Date() },
    { upsert: true }
  );
  const likeCount = await Like.countDocuments({ eventId, liked: true });
  await Event.updateOne({ _id: eventId }, { likeCount });
  return likeCount;
};

export const isEventLikedByUser = async (userId, eventId) => {
  if (!userId || !eventId) {
    throw new ValidationError("Missing required fields");
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
    { upsert: true }
  );
  const shareCount = await Share.countDocuments({ eventId, shared: true });
  await Event.updateOne({ _id: eventId }, { shareCount });
  return shareCount;
};
