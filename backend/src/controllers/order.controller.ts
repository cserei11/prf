import type { Request, Response } from "express"
import Order from "../models/order.model"
import Cart from "../models/cart.model"
import Product from "../models/product.model"

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const { shippingAddress } = req.body

    const cart = await Cart.findOne({ userId })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        })
      }
    }

    const order = new Order({
      userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      status: "pending",
      shippingAddress,
    })

    await order.save()

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    }

    cart.items = []
    cart.totalAmount = 0
    await cart.save()

    res.status(201).json({
      message: "Order created successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    const orders = await Order.find({ userId }).sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const orderId = req.params.id

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.userId.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json({
      message: "Order status updated",
      order,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

