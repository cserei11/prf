import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import type { Product } from "../../models/product.model"
import { ProductService } from "../../services/product.service"

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  products: Product[] = []
  filteredProducts: Product[] = []
  categories: string[] = []
  selectedCategory = ""
  searchTerm = ""
  isLoading = true

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params["category"]) {
        this.selectedCategory = params["category"]
      }

      this.loadProducts()
    })
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products

        // Extract unique categories
        this.categories = [...new Set(products.map((p) => p.category))]

        this.filterProducts()
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading products", error)
        this.isLoading = false
      },
    })
  }

  filterProducts(): void {
    let filtered = [...this.products]

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.category === this.selectedCategory)
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
      )
    }

    this.filteredProducts = filtered
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category
    this.filterProducts()
  }

  onSearch(): void {
    this.filterProducts()
  }
}

