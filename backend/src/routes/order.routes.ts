import express from "express"
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller"
import { authenticate, isAdmin, isCustomerOrAdmin } from "../middleware/auth.middleware"

const router = express.Router()

router.use(authenticate)

router.post("/", isCustomerOrAdmin, createOrder)
router.get("/user", isCustomerOrAdmin, getUserOrders)
router.get("/:id", isCustomerOrAdmin, getOrderById)

router.get("/", isAdmin, getAllOrders)
router.put("/:id/status", isAdmin, updateOrderStatus)

export default router

