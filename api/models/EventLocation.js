import mongoose from "mongoose";

const eventLocationSchema = new mongoose.Schema(
  {
    locationName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  }
);

const EventLocation = mongoose.model("EventLocation", eventLocationSchema);
export default EventLocation;
