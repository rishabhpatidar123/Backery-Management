import mongoose, { Schema } from "mongoose";

const AdSchema = new Schema({
  title: { type: String, required: true, trim: true },
  flashLine: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  imageUrl: { type: String, required: true },
  placement: { type: String, enum: ["home-banner", "sidebar"], required: true },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Ad = mongoose.models.Ad || mongoose.model("Ad", AdSchema);
