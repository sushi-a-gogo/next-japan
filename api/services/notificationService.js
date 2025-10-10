import mongoose from "mongoose";
import EventOpportunity from "../models/EventOpportunity.js";
import User from "../models/User.js";
import UserNotification, {
  formatNotification,
} from "../models/UserNotification.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export const fetchUserNotifications = async (userId) => {
  validateObjectId(userId, "userId");

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const notifications = await UserNotification.find({ userId, pending: false })
    .populate({
      path: "opportunityId",
      select: "startDate endDate timeZone timeZoneAbbreviation",
      populate: [
        {
          path: "eventId",
          select:
            "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
        },
      ],
    })
    .lean();
  console.log(notifications);
  return notifications.map(formatNotification);
};

export const fetchNotification = async (notificationId) => {
  validateObjectId(notificationId, "notificationId");

  const notification = await UserNotification.findById(notificationId)
    .populate({
      path: "opportunityId",
      select: "startDate endDate timeZone timeZoneAbbreviation",
      populate: [
        {
          path: "eventId",
          select:
            "_id eventTitle imageId cloudflareImageId imageWidth imageHeight",
        },
      ],
    })
    .lean();

  return notification ? formatNotification(notification) : null;
};

export const createUserNotification = async (data) => {
  const { userId, title, message, opportunityId } = data;

  if (!userId || !title || !message || !opportunityId) {
    throw new ValidationError("Missing required fields");
  }

  validateObjectId(userId, "userId");
  validateObjectId(opportunityId, "opportunityId");

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const opportunity = await EventOpportunity.findById(opportunityId);
  if (!opportunity) throw new NotFoundError("Opportunity not found");

  const notification = new UserNotification({
    userId,
    opportunityId,
    title,
    message,
  });
  const saved = await notification.save();
  return saved._id;
};

export const updateUserNotification = async (notificationId, data) => {
  const { userId, title, message, opportunityId } = data;

  if (!userId || !title || !message || !opportunityId) {
    throw new ValidationError("Missing required fields");
  }

  validateObjectId(notificationId, "notificationId");
  validateObjectId(userId, "userId");
  validateObjectId(opportunityId, "opportunityId");

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const opportunity = await EventOpportunity.findById(opportunityId);
  if (!opportunity) throw new NotFoundError("Opportunity not found");

  const updated = await UserNotification.findByIdAndUpdate(
    notificationId,
    { userId, opportunityId, title, message },
    { new: true }
  );

  return updated ? updated._id : null;
};

export const deleteUserNotification = async (notificationId, userId) => {
  if (notificationId === "all") {
    if (!userId) throw new ValidationError("userId query param required");
    validateObjectId(userId, "userId");

    const result = await UserNotification.deleteMany({ userId });
    return { userId, deletedCount: result.deletedCount };
  }

  validateObjectId(notificationId, "notificationId");

  const deleted = await UserNotification.findByIdAndDelete(notificationId);
  if (!deleted) throw new NotFoundError("Notification not found");

  return { notificationId: deleted._id };
};

// Helpers
function validateObjectId(id, field) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError(`Invalid ${field} format`);
  }
}
