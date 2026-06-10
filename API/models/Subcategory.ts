import mongoose, { Schema } from "mongoose";

const SubcategorySchema = new Schema({
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  categorySlug: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  weightLabel: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  productId: { type: String }
}, {
  timestamps: true
});

export const Subcategory = mongoose.models.Subcategory || mongoose.model("Subcategory", SubcategorySchema);
