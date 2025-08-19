import mongoose from "mongoose";

/**
 * UserNotification Schema
 *
 * Represents a notification that a user will see.
 * Notifications can be created immediately (pending=false),
 * or scheduled for later delivery (pending=true + sendAt).
 *
 * NOTE: In production, notifications would not usually store
 * registrationId. We include it here ONLY to simulate approval
 * events in the poller (see notificationPoller.js).
 */
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
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventRegistration",
      // NOTE: Only used for simulating approval in the poller.
    },
    sendAt: { type: Date, default: Date.now }, // when to deliver the notification
    pending: { type: Boolean, default: false }, // true if scheduled for later
  },
  { timestamps: true } // adds createdAt, updatedAt
);

const UserNotification = mongoose.model(
  "UserNotification",
  userNotificationSchema
);

/**
 * formatNotification
 *
 * Normalizes notification objects for API responses.
 */
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
  sendAt: notification.sendAt,
});

export default UserNotification;
