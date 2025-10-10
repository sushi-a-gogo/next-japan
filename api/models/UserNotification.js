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
const { Schema, model } = mongoose;

const userNotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: "EventOpportunity",
      required: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventRegistration",
      // NOTE: Only used for simulating approval in the poller.
    },
    sendAt: { type: Date, default: Date.now }, // when to deliver the notification
    pending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const formatNotification = (notification) => {
  const opportunity = notification.opportunityId || {};
  const event = opportunity.eventId || {};

  return {
    notificationId: notification._id,
    userId: notification.userId,
    title: notification.title ?? "",
    message: notification.message ?? "",
    pending: notification.pending ?? false,
    createdAt: notification.createdAt ?? null,
    updatedAt: notification.updatedAt ?? null,
    sendAt: notification.sendAt,
    opportunity: {
      opportunityId: opportunity._id ?? null,
      startDate: opportunity.startDate ?? null,
      endDate: opportunity.endDate ?? null,
      timeZone: opportunity.timeZone ?? null,
      timeZoneAbbreviation: opportunity.timeZoneAbbreviation ?? null,
      event: {
        eventId: event._id ?? null,
        eventTitle: event.eventTitle ?? "",
        image: {
          id: event.imageId ?? null,
          cloudflareImageId: event.cloudflareImageId ?? null,
          width: event.imageWidth ?? null,
          height: event.imageHeight ?? null,
        },
      },
    },
  };
};

export default model("UserNotification", userNotificationSchema);
