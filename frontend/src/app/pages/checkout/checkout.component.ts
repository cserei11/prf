import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import type { Cart, CartItem } from "../../models/cart.model"
import type { Product } from "../../models/product.model"
import { CartService } from "../../services/cart.service"
import { OrderService } from "../../services/order.service"
import { ProductService } from "../../services/product.service"

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null
  cartItems: (CartItem & { product?: Product })[] = []
  checkoutForm: FormGroup
  isLoading = true
  isSubmitting = false

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
  ) {
    this.checkoutForm = this.formBuilder.group({
      street: ["", Validators.required],
      city: ["", Validators.required],
      postalCode: ["", Validators.required],
      country: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadCart()
  }

  loadCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (cart) => {
        this.cart = cart

        if (!cart || cart.items.length === 0) {
          this.router.navigate(["/cart"])
          return
        }

        this.loadProductDetails()
      },
      error: (error) => {
        console.error("Error loading cart", error)
        this.isLoading = false
        this.router.navigate(["/cart"])
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

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.checkoutForm.controls).forEach((key) => {
        const control = this.checkoutForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true

    this.orderService
      .createOrder({
        shippingAddress: this.checkoutForm.value,
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false
          // Navigate to order confirmation page
          this.router.navigate(["/order-confirmation", response.order._id])
        },
        error: (error) => {
          console.error("Error creating order", error)
          this.isSubmitting = false
        },
      })
  }
}

