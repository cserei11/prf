import express from "express"
import { getUserCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cart.controller"
import { authenticate, isCustomerOrAdmin } from "../middleware/auth.middleware"

const router = express.Router()

router.use(authenticate)
router.use(isCustomerOrAdmin)

router.get("/", getUserCart)
router.post("/add", addToCart)
router.put("/update", updateCartItem)
router.delete("/remove/:productId", removeFromCart)
router.delete("/clear", clearCart)

export default router

