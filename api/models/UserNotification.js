import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    opportunityId: {
      type: String,
      required: true,
      ref: "EventOpportunity",
    },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  }
);

const UserNotification = mongoose.model(
  "UserNotification",
  userNotificationSchema
);

export const formatNotification = (notification) => ({
  notificationId: notification._id.toString(),
  userId: notification.userId,
  title: notification.title,
  message: notification.message,
  image: notification.opportunityId?.eventId
    ? {
        id: notification.opportunityId.eventId.imageId,
        cloudflareImageId: notification.opportunityId.eventId.cloudflareImageId,
        width: notification.opportunityId.eventId.imageWidth,
        height: notification.opportunityId.eventId.imageHeight,
      }
    : null,
  eventId: notification.opportunityId?.eventId?._id.toString() || null,
  eventTitle: notification.opportunityId?.eventId?.eventTitle || null,
  eventDate: notification.opportunityId.startDate,
  eventTimeZone: notification.opportunityId.timeZone,
  eventTimeZoneAbbreviation: notification.opportunityId.timeZoneAbbreviation,
  createdAt: notification.createdAt,
});

export default UserNotification;
