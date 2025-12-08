import { apiFetch } from '../lib/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/user';

export function loginRequest(data: LoginRequest) {
  return apiFetch<AuthResponse>('/login', { method: 'POST', body: data });
}

export function registerRequest(data: RegisterRequest) {
  return apiFetch<AuthResponse>('/register', { method: 'POST', body: data });
}

export function logoutRequest(token: string) {
  return apiFetch<void>('/logout', { method: 'POST', token });
}

export function fetchCurrentUser(token: string) {
  return apiFetch<AuthResponse['user']>('/user', { token });
}
