import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    orderNotes: { type: String },
    orderItems: [{}],
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model("Order", orderSchema);
