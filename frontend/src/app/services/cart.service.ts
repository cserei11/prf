import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "../models/cart.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`
  private cartSubject = new BehaviorSubject<Cart | null>(null)
  public cart$ = this.cartSubject.asObservable()

  constructor(private http: HttpClient) {}

  getUserCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(tap((cart) => this.cartSubject.next(cart)))
  }

  addToCart(data: AddToCartRequest): Observable<{ message: string; cart: Cart }> {
    return this.http
      .post<{ message: string; cart: Cart }>(`${this.apiUrl}/add`, data)
      .pipe(tap((response) => this.cartSubject.next(response.cart)))
  }

  updateCartItem(data: UpdateCartItemRequest): Observable<{ message: string; cart: Cart }> {
    return this.http
      .put<{ message: string; cart: Cart }>(`${this.apiUrl}/update`, data)
      .pipe(tap((response) => this.cartSubject.next(response.cart)))
  }

  removeFromCart(productId: string): Observable<{ message: string; cart: Cart }> {
    return this.http
      .delete<{ message: string; cart: Cart }>(`${this.apiUrl}/remove/${productId}`)
      .pipe(tap((response) => this.cartSubject.next(response.cart)))
  }

  clearCart(): Observable<{ message: string; cart: Cart }> {
    return this.http
      .delete<{ message: string; cart: Cart }>(`${this.apiUrl}/clear`)
      .pipe(tap((response) => this.cartSubject.next(response.cart)))
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value
    if (!cart) return 0

    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }
}

