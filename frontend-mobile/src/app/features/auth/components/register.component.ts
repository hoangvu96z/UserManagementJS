import { Component, OnInit } from '@angular/core';

import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { RegisterRequest, Country } from '../../../core/models/user.model';
import { APP_CONSTANT, MESSAGE_CONSTANT } from 'src/app/config/app-constant';
import { ToastOption } from 'src/app/shared/components/toast/toast-option.model';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterModule,
    AutocompleteComponent,
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
    IonButton,
    IonList
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userData: RegisterRequest = {
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: ''
  };
  
  countries: Country[] = [];
  // Autocomplete state
  filteredCountries: Country[] = [];
  showCountryList = false;
  highlightedIndex = -1;
  errorMessage = '';
  isLoading = false;
  showToast = false;
  toastOption : ToastOption = { type: 'info', message: '', duration: 1000 };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.userService.getCountries().subscribe({
      next: (countries: any) => {
        this.countries = countries.map((country: string) => ({
          name: country,
          code: country
        }));
        this.filteredCountries = this.countries.slice();
      },
      error: (error) => {
        console.error('Failed to load countries:', error);
      }
    });
  }

  // Called when user types into the country input
  onCountryInput(value: string): void {
    const q = (value || '').trim().toLowerCase();
    if (!q) {
      this.filteredCountries = this.countries.slice(0, 50);
      this.showCountryList = true;
      this.highlightedIndex = -1;
      return;
    }

    this.filteredCountries = this.countries
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 50);

    // always show list (it will show "No matches" when empty)
    this.showCountryList = true;
    this.highlightedIndex = -1;
  }

  onCountryFocus(): void {
    // show initial suggestions when user focuses the input
    this.filteredCountries = this.countries.slice(0, 50);
    this.showCountryList = true;
    this.highlightedIndex = -1;
  }

  // Select a country from suggestions
  onSelectCountry(name: string): void {
    this.userData.country = name;
    this.showCountryList = false;
  }

  // Keyboard navigation for country input
  onCountryKeydown(event: KeyboardEvent): void {
    if (!this.showCountryList) return;

    const key = event.key;
    if (key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredCountries.length - 1);
      return;
    }

    if (key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
      return;
    }

    if (key === 'Enter') {
      event.preventDefault();
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredCountries.length) {
        this.onSelectCountry(this.filteredCountries[this.highlightedIndex].name);
      }
      return;
    }

    if (key === 'Escape') {
      this.showCountryList = false;
      this.highlightedIndex = -1;
      return;
    }
  }

  onSubmit(): void {
    if (this.isLoading) return;

    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.showToast = true;
        this.toastOption = { type: 'success', message: MESSAGE_CONSTANT.REGISTER_SUCCESS, duration: 1000 };
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, APP_CONSTANT.TIME_NAVIGATION);
      },
      error: (error) => {
        this.showToast = true;
        this.errorMessage = error.error?.error || error.error?.message || MESSAGE_CONSTANT.REGISTER_FAILURE;
        this.toastOption = { type: 'danger', message: this.errorMessage, duration: 1000 };
        setTimeout(() => {
          this.showToast = false;
        }, APP_CONSTANT.TIME_NAVIGATION);
        this.isLoading = false;
      }
    });
  }
}
