import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  service: { type: String },
  status: { type: String, enum: ["new", "read", "replied"], default: "new" }
}, {
  timestamps: true
});

export const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
