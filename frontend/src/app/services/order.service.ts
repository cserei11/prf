import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Order, CreateOrderRequest } from "../models/order.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`

  constructor(private http: HttpClient) {}

  createOrder(data: CreateOrderRequest): Observable<{ message: string; order: Order }> {
    return this.http.post<{ message: string; order: Order }>(this.apiUrl, data)
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`)
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl)
  }

  updateOrderStatus(id: string, status: string): Observable<{ message: string; order: Order }> {
    return this.http.put<{ message: string; order: Order }>(`${this.apiUrl}/${id}/status`, { status })
  }
}

