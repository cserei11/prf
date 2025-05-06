import express from "express"
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller"
import { authenticate, isAdmin } from "../middleware/auth.middleware"

const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProductById)

router.post("/", authenticate, isAdmin, createProduct)
router.put("/:id", authenticate, isAdmin, updateProduct)
router.delete("/:id", authenticate, isAdmin, deleteProduct)

export default router

