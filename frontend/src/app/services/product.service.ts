import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Product, ProductCreateUpdate } from "../models/product.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  createProduct(product: ProductCreateUpdate): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(this.apiUrl, product)
  }

  updateProduct(id: string, product: ProductCreateUpdate): Observable<{ message: string; product: Product }> {
    return this.http.put<{ message: string; product: Product }>(`${this.apiUrl}/${id}`, product)
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
  }
}

