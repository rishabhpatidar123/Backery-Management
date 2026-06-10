import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema({
  regId: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
  registeredAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
