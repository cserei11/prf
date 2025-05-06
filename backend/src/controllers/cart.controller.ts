import type { Request, Response } from "express"
import Cart from "../models/cart.model"
import Product from "../models/product.model"
import mongoose from "mongoose"

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    let cart = await Cart.findOne({ userId })

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalAmount: 0,
      })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" })
    }

    let cart = await Cart.findOne({ userId })

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalAmount: 0,
      })
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
        price: product.price,
      })
    }

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()

    res.json({
      message: "Item added to cart",
      cart,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" })
    }

    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" })
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()

    res.json({
      message: "Cart updated",
      cart,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const { productId } = req.params

    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId)

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()

    res.json({
      message: "Item removed from cart",
      cart,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    cart.items = []
    cart.totalAmount = 0

    await cart.save()

    res.json({
      message: "Cart cleared",
      cart,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

