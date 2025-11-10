import mongoose from "mongoose";

const coordinatorSchema = new mongoose.Schema({
  eventCoordinatorId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  biography: { type: String },
  imageId: { type: String },
  cloudflareImageId: { type: String },
  imageWidth: { type: Number },
  imageHeight: { type: Number },
});

const eventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  imageId: { type: String, required: true },
  imageHeight: { type: Number, required: true },
  imageWidth: { type: Number, required: true },
  cloudflareImageId: { type: String, required: true },
  locationId: {
    type: String,
    required: true,
    ref: "EventLocation",
  },
  createdAt: { type: Date, default: Date.now },
  aiProvider: { type: String, enum: ["OpenAI", "Grok"], default: "OpenAI" },
  imagePrompt: { type: String },
  textPrompt: { type: String },
  eventCoordinators: {
    type: [coordinatorSchema],
    default: () => [
      {
        eventCoordinatorId: "coord1",
        firstName: "Mya",
        lastName: "Ashford",
        email: "xx@yy.zz",
        imageId: "coordinator-2.png",
        cloudflareImageId: "cf68e1ff-447c-487f-60be-d0e3abfdc800",
        imageWidth: 255,
        imageHeight: 255,
      },
    ],
  },
});

// Define indexes in the schema
eventSchema.index({ eventTitle: 1, description: 1, fullDescription: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
