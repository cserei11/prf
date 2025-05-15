import { Component, type OnInit } from "@angular/core"
import type { Product } from "../../models/product.model"
import { ProductService } from "../../services/product.service"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = []
  categories: string[] = []
  isLoading = true

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 4)

        this.categories = [...new Set(products.map((p) => p.category))]

        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading products", error)
        this.isLoading = false
      },
    })
  }
}

