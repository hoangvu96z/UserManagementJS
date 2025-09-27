import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UpdateUserRequest, Country } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }

  updateUser(userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user`, userData);
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`);
  }
}
