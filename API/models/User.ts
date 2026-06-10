import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
