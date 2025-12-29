// models/Visitor.js
import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    ip: { type: String }, // optional, hashed
    userAgent: { type: String },
    referrer: { type: String }, // often empty/missing
  },
  { timestamps: true } // createdAt will be our accurate server timestamp
);

export default mongoose.model("Visitor", VisitorSchema);
