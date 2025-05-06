export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "customer" | "guest"
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

