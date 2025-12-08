import { Component, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';
import { ToastComponent } from 'src/app/shared';
import { APP_CONSTANT, MESSAGE_CONSTANT } from 'src/app/constant/app-constant';
import { ToastOption } from 'src/app/shared/toast/toast-option.model';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule,
    ToastComponent,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonItem,
    IonInput,
    IonLabel,
    IonCheckbox,
    IonButton,
    IonList
  ],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: '',
    rememberMe: false
  };

  toastOption : ToastOption = { type: 'info', message: '', duration: 1000 };
  showToast = false;
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
        this.showToast = true;
        this.toastOption = { type: 'success', message: MESSAGE_CONSTANT.LOGIN_SUCCESS, duration: 1000 };
        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/dashboard']);
        }, APP_CONSTANT.TIME_NAVIGATION);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.toastOption = { type: 'danger', message: MESSAGE_CONSTANT.LOGIN_FAILURE, duration: 1000 };
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, APP_CONSTANT.TIME_NAVIGATION);
        this.isLoading = false;
      }
    });
  }
}
