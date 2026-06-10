import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const ShippingAddressSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true }
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", default: null },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["upi", "cod"], required: true },
  shippingAddress: ShippingAddressSchema,
  status: { 
    type: String, 
    enum: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"], 
    default: "Pending" 
  }
}, {
  timestamps: true
});

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
