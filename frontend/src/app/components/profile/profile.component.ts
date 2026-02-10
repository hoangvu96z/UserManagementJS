import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { User, UpdateUserRequest, Country } from '../../models/user.model';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectCurrentUser } from '../../store/auth/auth.reducer';
import { ProfileActions } from '../../store/profile/profile.actions';
import {
  selectCountries,
  selectUpdateError,
  selectUpdateLoading,
  selectUpdateSuccessMessage,
} from '../../store/profile/profile.reducer';
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
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.currentUser = user;
        if (user) {
          this.updateData = {
            nickname: user.nickname,
            phone: user.phone,
            country: user.country,
          };
        }
      });

    this.store
      .select(selectCountries)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countries) => (this.countries = countries));

    this.store
      .select(selectUpdateSuccessMessage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => (this.successMessage = message ?? ''));

    this.store
      .select(selectUpdateError)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => (this.errorMessage = error ?? ''));

    this.store
      .select(selectUpdateLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => (this.isLoading = loading));

    if (this.authService.isAuthenticated()) {
      this.store.dispatch(AuthActions.loadCurrentUser());
    }
    this.store.dispatch(ProfileActions.resetFeedback());
    this.store.dispatch(ProfileActions.loadCountries());
  }

  onSubmit(): void {
    if (this.isLoading) return;

    this.store.dispatch(ProfileActions.resetFeedback());
    this.store.dispatch(ProfileActions.updateProfile({ update: this.updateData }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
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
