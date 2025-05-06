import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"

// Interceptors
import { AuthInterceptor } from "./interceptors/auth.interceptor"

// Components
import { HeaderComponent } from "./components/header/header.component"
import { ProductCardComponent } from "./components/product-card/product-card.component"

// Pages
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductCardComponent,
    HomeComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderConfirmationComponent,
    OrdersComponent,
    LoginComponent,
    RegisterComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}

