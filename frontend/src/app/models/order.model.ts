import type { CartItem } from "./cart.model"

export interface ShippingAddress {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface Order {
  _id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered"
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress
}

