import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    subscriptionPlan: { type: String, required: true },
    imageId: { type: String },
    cloudflareImageId: { type: String },
    imageWidth: { type: Number },
    imageHeight: { type: Number },
    phone: { type: String },
    isEmailPreferred: { type: Boolean },
    mode: { type: String },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;
