import mongoose, { type Document, Schema } from "mongoose"

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  quantity: number
  price: number
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId
  items: ICartItem[]
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
})

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [CartItemSchema],
  totalAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

CartSchema.pre<ICart>("save", function (next) {
  this.updatedAt = new Date()

  this.totalAmount = this.items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  next()
})

export default mongoose.model<ICart>("Cart", CartSchema)

