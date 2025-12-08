export interface User {
  id: string;
  nickname: string;
  email: string;
  phone: string;
  country: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
}

export interface UpdateUserRequest {
  nickname: string;
  phone: string;
  country: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Country {
  name: string;
  code: string;
}
