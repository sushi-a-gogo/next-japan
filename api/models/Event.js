import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  imageId: { type: String, required: true },
  imageHeight: { type: Number, required: true },
  imageWidth: { type: Number, required: true },
  cloudflareImageId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  aiProvider: { type: String, enum: ["OpenAI", "Grok"], default: "OpenAI" },
  imagePrompt: { type: String },
  textPrompt: { type: String },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
