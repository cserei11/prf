import mongoose, { type Document, Schema } from "mongoose"
import type { ICartItem } from "./cart.model"

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  items: ICartItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered"
  shippingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

OrderSchema.pre<IOrder>("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model<IOrder>("Order", OrderSchema)

