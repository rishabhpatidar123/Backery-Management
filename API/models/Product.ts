import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  isFeatured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
