import { Component, OnInit } from '@angular/core';

import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RegisterRequest, Country } from '../../models/user.model';


@Component({
    selector: 'app-register',
    imports: [FormsModule, RouterModule, AutocompleteComponent],
    templateUrl: './register.component.html',
    styles: [
      `:host { display: block; }
       .autocomplete-list {
         position: absolute;
         z-index: 1200;
         width: 100%;
         max-height: 220px;
         overflow-y: auto;
         background: #fff;
         border: 1px solid rgba(0,0,0,0.12);
         box-shadow: 0 6px 12px rgba(0,0,0,0.08);
         border-radius: 4px;
         margin-top: 4px;
       }
       .autocomplete-item {
         padding: 8px 12px;
         cursor: pointer;
         border-bottom: 1px solid rgba(0,0,0,0.04);
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
       }
       .autocomplete-item:last-child { border-bottom: none; }
       .autocomplete-item:hover, .autocomplete-item.highlight {
         background: #f1f5ff;
       }
       .autocomplete-empty {
         padding: 8px 12px;
         color: #666;
       }
      `
    ]
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
        // Convert string array to Country objects
        this.countries = countries.map((country: string) => ({
          name: country,
          code: country
        }));
        // initialize filtered list
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
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
