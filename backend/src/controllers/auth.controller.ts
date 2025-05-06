import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model"
import { JWT_SECRET } from "../middleware/auth.middleware"

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = new User({
      username,
      email,
      password,
      role: "customer", // Default role
    })

    await user.save()

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}

