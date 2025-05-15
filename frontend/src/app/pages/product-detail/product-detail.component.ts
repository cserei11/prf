import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import type { Product } from "../../models/product.model"
import { ProductService } from "../../services/product.service"
import { CartService } from "../../services/cart.service"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null
  quantity = 1
  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"]
      this.loadProduct(id)
    })
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading product", error)
        this.isLoading = false
        this.router.navigate(["/products"])
      },
    })
  }

  addToCart(): void {
    if (!this.product) return

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
        },
        error: (error) => {
          console.error("Error adding to cart", error)
        },
      })
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
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

