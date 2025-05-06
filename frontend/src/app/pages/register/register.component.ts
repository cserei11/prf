import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup
  isSubmitting = false
  errorMessage = ""

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/"])
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return
    }

    this.isSubmitting = true
    this.errorMessage = ""

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isSubmitting = false
        this.router.navigate(["/"])
      },
      error: (error) => {
        this.isSubmitting = false
        this.errorMessage = error.error.message || "Registration failed. Please try again."
      },
    })
  }
}

