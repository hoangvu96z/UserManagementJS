export interface User {
  id: string;
  email: string;
  nickname: string;
  phone?: string;
  country?: string;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
  phone?: string;
  country?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateUserRequest {
  nickname: string;
  phone: string;
  country: string;
}

export interface Country {
  name: string;
  code: string;
}
