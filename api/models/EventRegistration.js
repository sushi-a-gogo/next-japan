import mongoose from "mongoose";

/**
 * EventRegistration Schema
 *
 * Represents a user's request to join an event.
 * Normally, admins or rules would approve/reject registrations.
 * In this demo app, approvals are simulated automatically via
 * the notification poller.
 */
const eventRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User", // References User collection
    },
    opportunityId: {
      type: String,
      required: true,
      ref: "EventOpportunity",
    },
    status: {
      type: String,
      required: true,
      enum: ["requested", "registered", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);
eventRegistrationSchema.index({ userId: 1 }); // For GET /user/:userId
eventRegistrationSchema.index({ opportunityId: 1 }); // For population and queries
const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);

/**
 * Normalizes an EventRegistration document for API responses.
 * @param reg - Raw EventRegistration document from MongoDB.
 * @returns Normalized registration object for the frontend.
 */
export const formatRegistration = (reg) => {
  // Extract nested objects for readability
  const opportunity = reg.opportunityId || null;
  const event = opportunity?.eventId || null;
  const location = event?.locationId || null;

  return {
    registrationId: reg._id?.toString() || null,
    userId: reg.userId || null,
    status: reg.status || null,
    opportunity: opportunity
      ? {
          opportunityId: opportunity._id?.toString() || null,
          eventId: event?._id?.toString() || null,
          startDate: opportunity.startDate || null,
          endDate: opportunity.endDate || null,
          timeZone: opportunity.timeZone || "Asia/Tokyo",
          timeZoneAbbreviation: opportunity.timeZoneAbbreviation || "JST",
          timeZoneOffset: opportunity.timeZoneOffset ?? 9,
          notes: opportunity.notes || "",
        }
      : null,
    eventTitle: event?.eventTitle || null,
    location: location
      ? {
          locationName: location.locationName || "",
          addressLine1: location.addressLine1 || "",
          city: location.city || "",
          state: location.state || "",
          zip: location.zip || "",
          latitude: location.latitude ?? null,
          longitude: location.longitude ?? null,
        }
      : null,
    image: event
      ? {
          id: event.imageId || null,
          cloudflareImageId: event.cloudflareImageId || null,
          width: event.imageWidth ?? null,
          height: event.imageHeight ?? null,
        }
      : null,
    createdAt: reg.createdAt || null,
  };
};
export default EventRegistration;
