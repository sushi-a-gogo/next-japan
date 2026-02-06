// models/Like.js
import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    liked: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Like", LikeSchema);
