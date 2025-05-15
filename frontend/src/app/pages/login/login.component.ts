import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isSubmitting = false
  errorMessage = ""

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/"])
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    this.isSubmitting = true
    this.errorMessage = ""

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isSubmitting = false
        this.router.navigate(["/"])
      },
      error: (error) => {
        this.isSubmitting = false
        this.errorMessage = error.error.message || "Login failed. Please try again."
      },
    })
  }
}

