export interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface ProductCreateUpdate {
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

