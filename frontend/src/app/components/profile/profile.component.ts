import { Component, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, UpdateUserRequest, Country } from '../../models/user.model';
import { HeaderComponent } from '../header/header.component';
import { AutocompleteComponent } from 'src/app/shared/autocomplete/autocomplete.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-profile',
    imports: [FormsModule, RouterModule, HeaderComponent, FooterComponent, AutocompleteComponent],
    templateUrl: './profile.component.html',
    styles: []
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  countries: Country[] = [];
  updateData: UpdateUserRequest = {
    nickname: '',
    phone: '',
    country: ''
  };
  
  successMessage = '';
  errorMessage = '';
  isLoading = false;
  private readonly authService: AuthService = inject(AuthService);
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.updateData = {
          nickname: user.nickname,
          phone: user.phone,
          country: user.country
        };
      }
    });

    this.loadCountries();
  }

  loadCountries(): void {
    this.userService.getCountries().subscribe({
      next: (countries: any) => {
        this.countries = countries.map((country: string) => ({
          name: country,
          code: country
        }));
      },
      error: (error) => {
        console.error('Failed to load countries:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateUser(this.updateData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.authService.loadCurrentUser?.();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        console.log('Logout failed, clearing local session.');
        
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
