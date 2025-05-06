import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"

import { HomeComponent } from "./pages/home/home.component"
import { ProductListComponent } from "./pages/product-list/product-list.component"
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component"
import { CartComponent } from "./pages/cart/cart.component"
import { CheckoutComponent } from "./pages/checkout/checkout.component"
import { OrderConfirmationComponent } from "./pages/order-confirmation/order-confirmation.component"
import { OrdersComponent } from "./pages/orders/orders.component"
import { LoginComponent } from "./pages/login/login.component"
import { RegisterComponent } from "./pages/register/register.component"
import { AdminProductsComponent } from "./pages/admin/admin-products/admin-products.component"
import { AdminOrdersComponent } from "./pages/admin/admin-orders/admin-orders.component"

import { AuthGuard } from "./guards/auth.guard"
import { AdminGuard } from "./guards/admin.guard"

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "products", component: ProductListComponent },
  { path: "products/:id", component: ProductDetailComponent },
  { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
  { path: "checkout", component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: "order-confirmation/:id", component: OrderConfirmationComponent, canActivate: [AuthGuard] },
  { path: "orders", component: OrdersComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "admin/products", component: AdminProductsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: "admin/orders", component: AdminOrdersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: "**", redirectTo: "" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

