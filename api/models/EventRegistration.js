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
export default EventRegistration;
