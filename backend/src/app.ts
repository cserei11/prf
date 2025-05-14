import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes"
import productRoutes from "./routes/product.routes"
import cartRoutes from "./routes/cart.routes"
import orderRoutes from "./routes/order.routes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGO_URL || "mongodb://localhost:27017/mobile-store"

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

export default app
