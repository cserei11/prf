import { Component, Input, type OnInit } from "@angular/core"
import type { Product } from "../../models/product.model"
import { CartService } from "../../services/cart.service"
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.scss"],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product
  quantity = 1

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(["/login"])
      return
    }

    if (!this.authService.isCustomer()) {
      return
    }

    this.cartService
      .addToCart({
        productId: this.product._id,
        quantity: this.quantity,
      })
      .subscribe({
        next: () => {
          // Show success message or notification
        },
        error: (error) => {
          console.error("Error adding to cart", error)
        },
      })
  }

  incrementQuantity(): void {
    if (this.quantity < this.product.stock) {
      this.quantity++
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  isCustomer(): boolean {
    return this.authService.isCustomer()
  }
}

