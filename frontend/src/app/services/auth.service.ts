
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';
import { AuthActions } from '../store/auth/auth.actions';
import { selectCurrentUser } from '../store/auth/auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public currentUser$ = this.store.select(selectCurrentUser);

  constructor(private http: HttpClient, private store: Store) {
    if (this.isAuthenticated()) {
      this.loadCurrentUser();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.store.dispatch(AuthActions.loginSuccess({ user: response.user }));
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.store.dispatch(AuthActions.registerSuccess({ user: response.user }));
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  public loadCurrentUser(): void {
    this.store.dispatch(AuthActions.loadCurrentUser());
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    let currentUser: User | null = null;
    this.currentUser$
      .pipe(take(1))
      .subscribe((user) => (currentUser = user));
    return currentUser;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
