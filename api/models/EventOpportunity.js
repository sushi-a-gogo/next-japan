import mongoose from "mongoose";

const eventOpportunitySchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      index: true,
      ref: "Event", // Reference to existing Event collection
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
  },
);

// Create indexes
eventOpportunitySchema.index({ startDate: 1, endDate: 1 });

const EventOpportunity = mongoose.model(
  "EventOpportunity",
  eventOpportunitySchema,
);
export default EventOpportunity;
