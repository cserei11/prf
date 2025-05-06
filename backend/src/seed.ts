import bcrypt from "bcrypt"
import User from "./models/user.model"
import Product from "./models/product.model"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mobile-store"

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    seedDatabase().finally(() => mongoose.disconnect())
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

export const seedDatabase = async () => {
  try {
    await User.deleteMany({})
    await Product.deleteMany({})

    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: "adminPassword",
      role: "admin",
    })
    await admin.save()

    const customerPassword = await bcrypt.hash("customer123", 10)
    const customer = new User({
      username: "customer",
      email: "customer@example.com",
      password: customerPassword,
      role: "customer",
    })
    await customer.save()

    const products = [
      {
        name: "iPhone 15 Pro",
        description: "Latest iPhone with advanced features",
        price: 999.99,
        stock: 50,
        category: "Smartphones",
        imageUrl: "/images/iphone15pro.jpg",
      },
      {
        name: "Samsung Galaxy S23",
        description: "Flagship Android smartphone with excellent camera",
        price: 899.99,
        stock: 45,
        category: "Smartphones",
        imageUrl: "/images/galaxys23.jpg",
      },
      {
        name: "Google Pixel 8",
        description: "Pure Android experience with top-tier camera",
        price: 799.99,
        stock: 30,
        category: "Smartphones",
        imageUrl: "/images/pixel8.jpg",
      },
      {
        name: "iPad Air",
        description: "Lightweight tablet for productivity and entertainment",
        price: 599.99,
        stock: 35,
        category: "Tablets",
        imageUrl: "/images/ipadair.jpg",
      },
      {
        name: "Samsung Galaxy Tab S9",
        description: "Premium Android tablet with S Pen support",
        price: 649.99,
        stock: 25,
        category: "Tablets",
        imageUrl: "/images/galaxytabs9.jpg",
      },
      {
        name: "Apple Watch Series 9",
        description: "Advanced health monitoring and connectivity",
        price: 399.99,
        stock: 40,
        category: "Wearables",
        imageUrl: "/images/applewatch9.jpg",
      },
      {
        name: "Samsung Galaxy Watch 6",
        description: "Comprehensive health tracking with elegant design",
        price: 349.99,
        stock: 30,
        category: "Wearables",
        imageUrl: "/images/galaxywatch6.jpg",
      },
      {
        name: "AirPods Pro 2",
        description: "Noise cancelling wireless earbuds with spatial audio",
        price: 249.99,
        stock: 60,
        category: "Audio",
        imageUrl: "/images/airpodspro2.jpg",
      },
    ]

    await Product.insertMany(products)

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

