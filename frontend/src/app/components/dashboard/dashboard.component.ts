import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectCurrentUser } from '../../store/auth/auth.reducer';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-dashboard',
    imports: [RouterModule, HeaderComponent, FooterComponent],
    templateUrl: './dashboard.component.html',
    styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        this.currentUser = user;
      });

    if (this.authService.isAuthenticated()) {
      this.store.dispatch(AuthActions.loadCurrentUser());
    }
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
