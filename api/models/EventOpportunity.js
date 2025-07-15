import mongoose from "mongoose";

const eventOpportunitySchema = new mongoose.Schema(
  {
    opportunityId: {
      type: Number,
      required: true,
      unique: true,
    },
    eventId: {
      type: String,
      required: true,
      ref: "Event", // Reference to your existing Event collection
    },
    locationId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
      default: "Asia/Tokyo",
    },
    timeZoneAbbreviation: {
      type: String,
      required: true,
      default: "JST",
    },
    timeZoneOffset: {
      type: Number,
      required: true,
      default: 9,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  }
);

const EventOpportunity = mongoose.model(
  "EventOpportunity",
  eventOpportunitySchema
);
export default EventOpportunity;
