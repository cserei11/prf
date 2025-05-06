import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import type { Cart, CartItem } from "../../models/cart.model"
import type { Product } from "../../models/product.model"
import { CartService } from "../../services/cart.service"
import { ProductService } from "../../services/product.service"

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null
  cartItems: (CartItem & { product?: Product })[] = []
  isLoading = true

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCart()
  }

  loadCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (cart) => {
        this.cart = cart
        this.loadProductDetails()
      },
      error: (error) => {
        console.error("Error loading cart", error)
        this.isLoading = false
      },
    })
  }

  loadProductDetails(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.cartItems = []
      this.isLoading = false
      return
    }

    // Create a copy of cart items to add product details
    this.cartItems = [...this.cart.items]

    // Load product details for each item
    const productPromises = this.cartItems.map((item, index) => {
      return this.productService
        .getProductById(item.productId.toString())
        .toPromise()
        .then((product) => {
          if (product) {
            this.cartItems[index] = { ...item, product }
          }
        })
    })

    Promise.all(productPromises)
      .then(() => {
        this.isLoading = false
      })
      .catch((error) => {
        console.error("Error loading product details", error)
        this.isLoading = false
      })
  }

  updateQuantity(item: CartItem & { product?: Product }, newQuantity: number): void {
    if (!item.product) return

    if (newQuantity <= 0) {
      this.removeItem(item)
      return
    }

    if (newQuantity > item.product.stock) {
      // Show error message
      return
    }

    this.cartService
      .updateCartItem({
        productId: item.productId.toString(),
        quantity: newQuantity,
      })
      .subscribe({
        next: (response) => {
          this.cart = response.cart
          this.loadProductDetails()
        },
        error: (error) => {
          console.error("Error updating cart", error)
        },
      })
  }

  removeItem(item: CartItem & { product?: Product }): void {
    this.cartService.removeFromCart(item.productId.toString()).subscribe({
      next: (response) => {
        this.cart = response.cart
        this.loadProductDetails()
      },
      error: (error) => {
        console.error("Error removing item from cart", error)
      },
    })
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (response) => {
        this.cart = response.cart
        this.cartItems = []
      },
      error: (error) => {
        console.error("Error clearing cart", error)
      },
    })
  }

  checkout(): void {
    this.router.navigate(["/checkout"])
  }
}

