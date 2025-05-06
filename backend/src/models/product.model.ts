import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

ProductSchema.pre<IProduct>("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model<IProduct>("Product", ProductSchema)

