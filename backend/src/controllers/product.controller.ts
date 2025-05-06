import type { Request, Response } from "express"
import Product from "../models/product.model"

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
    })

    await product.save()

    res.status(201).json({
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
        updatedAt: new Date(),
      },
      { new: true },
    )

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

