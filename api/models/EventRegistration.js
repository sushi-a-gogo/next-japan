import mongoose from "mongoose";

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

export const formatRegistration = (reg) => ({
  registrationId: reg._id.toString(),
  userId: reg.userId,
  status: reg.status,
  opportunity: reg.opportunityId
    ? {
        opportunityId: reg.opportunityId._id.toString(),
        eventId: reg.opportunityId.eventId?._id.toString(), // Add eventId (string from EventOpportunity)
        startDate: reg.opportunityId.startDate,
        endDate: reg.opportunityId.endDate,
        timeZone: reg.opportunityId.timeZone,
        timeZoneAbbreviation: reg.opportunityId.timeZoneAbbreviation,
        timeZoneOffset: reg.opportunityId.timeZoneOffset,
        notes: reg.opportunityId.notes,
      }
    : null,
  eventTitle: reg.opportunityId?.eventId?.eventTitle || null,
  location: reg.opportunityId?.locationId
    ? {
        locationName: reg.opportunityId.locationId.locationName,
        addressLine1: reg.opportunityId.locationId.addressLine1,
        city: reg.opportunityId.locationId.city,
        state: reg.opportunityId.locationId.state,
        zip: reg.opportunityId.locationId.zip,
        latitude: reg.opportunityId.locationId.latitude,
        longitude: reg.opportunityId.locationId.longitude,
      }
    : null,
  image: reg.opportunityId?.eventId
    ? {
        id: reg.opportunityId.eventId.imageId,
        cloudflareImageId: reg.opportunityId.eventId.cloudflareImageId,
        width: reg.opportunityId.eventId.imageWidth,
        height: reg.opportunityId.eventId.imageHeight,
      }
    : null,
  createdAt: reg.createdAt,
});

export default EventRegistration;
