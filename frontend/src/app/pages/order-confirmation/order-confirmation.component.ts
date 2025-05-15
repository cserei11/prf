import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import type { Order } from "../../models/order.model"
import { OrderService } from "../../services/order.service"
import { ProductService } from "../../services/product.service"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-order-confirmation",
  templateUrl: "./order-confirmation.component.html",
  styleUrls: ["./order-confirmation.component.scss"],
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null
  orderItems: any[] = []
  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"]
      if (id) {
        this.loadOrder(id)
      } else {
        this.router.navigate(["/"])
      }
    })
  }

  loadOrder(id: string): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order
        this.loadProductDetails()
      },
      error: (error) => {
        console.error("Error loading order", error)
        this.isLoading = false
        this.router.navigate(["/"])
      },
    })
  }

  loadProductDetails(): void {
    if (!this.order || this.order.items.length === 0) {
      this.orderItems = []
      this.isLoading = false
      return
    }

    this.orderItems = [...this.order.items]

    const productPromises = this.orderItems.map((item, index) => {
      return this.productService
        .getProductById(item.productId.toString())
        .toPromise()
        .then((product) => {
          if (product) {
            this.orderItems[index] = { ...item, product }
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

  getStatusClass(status: string): string {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  isCustomer(): boolean {
    return this.authService.isCustomer()
  }
}

