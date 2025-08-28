import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  shared: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Share", ShareSchema);
