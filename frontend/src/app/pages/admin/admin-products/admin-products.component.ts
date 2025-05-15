import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Product, ProductCreateUpdate } from "../../../models/product.model"
import { ProductService } from "../../../services/product.service"

@Component({
  selector: "app-admin-products",
  templateUrl: "./admin-products.component.html",
  styleUrls: ["./admin-products.component.scss"],
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = []
  productForm: FormGroup
  isLoading = true
  isSubmitting = false
  isEditing = false
  currentProductId: string | null = null
  showForm = false

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) {
    this.productForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(0.01)]],
      stock: ["", [Validators.required, Validators.min(0)]],
      category: ["", Validators.required],
      imageUrl: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading products", error)
        this.isLoading = false
      },
    })
  }

  openCreateForm(): void {
    this.isEditing = false
    this.currentProductId = null
    this.productForm.reset()
    this.showForm = true
  }

  openEditForm(product: Product): void {
    this.isEditing = true
    this.currentProductId = product._id
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl,
    })
    this.showForm = true
  }

  cancelForm(): void {
    this.showForm = false
    this.productForm.reset()
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true

    const productData: ProductCreateUpdate = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      stock: this.productForm.value.stock,
      category: this.productForm.value.category,
      imageUrl: this.productForm.value.imageUrl,
    }

    if (this.isEditing && this.currentProductId) {
      this.productService.updateProduct(this.currentProductId, productData).subscribe({
        next: () => {
          this.isSubmitting = false
          this.showForm = false
          this.loadProducts()
        },
        error: (error) => {
          console.error("Error updating product", error)
          this.isSubmitting = false
        },
      })
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.isSubmitting = false
          this.showForm = false
          this.loadProducts()
        },
        error: (error) => {
          console.error("Error creating product", error)
          this.isSubmitting = false
        },
      })
    }
  }

  deleteProduct(id: string): void {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts()
        },
        error: (error) => {
          console.error("Error deleting product", error)
        },
      })
    }
  }
}

