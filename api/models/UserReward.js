// models/Like.js
import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    pointsEarned: { type: Number, required: true },
    pointsRemaining: { type: Number, required: true },
    dateOfIssue: { type: Date, required: true },
    expiration: { type: Date, required: true },
    description: { type: String },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model("UserReward", RewardSchema);
