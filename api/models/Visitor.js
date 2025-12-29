import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", VisitorSchema);
