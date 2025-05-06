import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.model"

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

//todo
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Admin privileges required." })
  }
}

export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "customer") {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Customer privileges required." })
  }
}

export const isCustomerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === "customer" || req.user.role === "admin")) {
    next()
  } else {
    res.status(403).json({ message: "Access denied. Customer or admin privileges required." })
  }
}

