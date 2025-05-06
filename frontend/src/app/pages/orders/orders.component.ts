import { Component, type OnInit } from "@angular/core"
import type { Order } from "../../models/order.model"
import { OrderService } from "../../services/order.service"

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = []
  isLoading = true

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading orders", error)
        this.isLoading = false
      },
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
}

