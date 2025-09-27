import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
    selector: 'app-login',
    imports: [FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: '',
    rememberMe: false
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
