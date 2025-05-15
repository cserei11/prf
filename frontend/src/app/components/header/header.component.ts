import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import type { Observable } from "rxjs"
import type { User } from "../../models/user.model"
import { AuthService } from "../../services/auth.service"
import { CartService } from "../../services/cart.service"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>
  cartItemCount = 0
  isMenuOpen = false

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
  ) {
    this.currentUser$ = this.authService.currentUser$
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      if (cart) {
        this.cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0)
      } else {
        this.cartItemCount = 0
      }
    })

    if (this.authService.isLoggedIn() && this.authService.isCustomer()) {
      this.cartService.getUserCart().subscribe()
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/"])
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  isAdmin(): boolean {
    return this.authService.isAdmin()
  }

  isCustomer(): boolean {
    return this.authService.isCustomer()
  }
}

