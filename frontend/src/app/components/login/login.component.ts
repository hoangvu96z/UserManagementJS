import { Component, inject, OnInit } from '@angular/core';

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
export class LoginComponent implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: '',
    rememberMe: false
  };


  
  errorMessage = '';
  isLoading = false;
  private authService: AuthService = inject(AuthService);
  constructor(
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.loadCurrentUser();
    }
  }
  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
