'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, logoutRequest, registerRequest, fetchCurrentUser } from '../services/auth';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/user';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authLoading: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    refreshUser();
  }, []);

  const saveSession = (response: AuthResponse) => {
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };

  const login = async (data: LoginRequest) => {
    setAuthLoading(true);
    try {
      const response = await loginRequest(data);
      saveSession(response);
      return response;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setAuthLoading(true);
    try {
      const response = await registerRequest(data);
      saveSession(response);
      return response;
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userResponse = await fetchCurrentUser(token);
      setUser(userResponse);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch (error) {
      console.error('Logout failed, clearing local session.', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, loading, authLoading, login, register, logout, refreshUser }),
    [user, loading, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
