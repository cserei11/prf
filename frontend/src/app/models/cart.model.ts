export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  productId: string
  quantity: number
}

