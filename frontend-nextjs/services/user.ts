import { apiFetch } from '../lib/api';
import { Country, UpdateUserRequest, User } from '../types/user';

export function updateUser(token: string, data: UpdateUserRequest) {
  return apiFetch<User>('/user', { method: 'PUT', body: data, token });
}

export function fetchCountries(token?: string | null) {
  return apiFetch<Country[]>('/countries', { token: token || undefined });
}
