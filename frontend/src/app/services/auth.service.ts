import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import type { User, AuthResponse, LoginRequest, RegisterRequest } from "../models/user.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUser()
  }

  private loadUser(): void {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        this.currentUserSubject.next(user)
      } catch (error) {
        this.logout()
      }
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap((response) => this.handleAuthentication(response)))
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(tap((response) => this.handleAuthentication(response)))
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
  }

  getCurrentUser(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        this.currentUserSubject.next(response.user)
        localStorage.setItem("user", JSON.stringify(response.user))
      })
    )
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem("token")
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value
    return user?.role === "admin"
  }

  isCustomer(): boolean {
    const user = this.currentUserSubject.value
    return user?.role === "customer"
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  private handleAuthentication(response: AuthResponse): void {
    const { token, user } = response
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUserSubject.next(user)
  }
}

