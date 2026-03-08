'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../components/Toast';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, authLoading } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '', rememberMe: false });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger' | 'info'>('info');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      // Wait for the login function and check return value (token, success boolean, or user object)
      const result = await login(credentials);

      // Normalize detection of success across possible return shapes
      const isSuccess =
        result === true ||
        (result && typeof result === 'object' && (result.token || result.user || result.success));

      if (!isSuccess) {
        throw new Error('Login failed. Please check your credentials.');
      }

      setToastType('success');
      setToastMessage('Login successful!');
      setShowToast(true);

      // Prefer router.replace for navigation (no backward history). Immediate navigation avoids timing issues.
      try {
        router.replace('/dashboard');
      } catch (navErr) {
        // Fallback if router navigation fails for some reason.
        try {
          window.location.assign('/dashboard');
        } catch {
          // ignore fallback errors
        }
      }
    } catch (error: any) {
      setToastType('danger');
      setToastMessage('Login failed. Please try again.');
      setShowToast(true);
      setErrorMessage(error?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
        duration={1200}
      />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-3">Welcome Back</h2>
              <p className="text-center text-secondary mb-4">Sign in to your account to continue</p>

              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="Enter your username or email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={credentials.rememberMe}
                    onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={authLoading}>
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-4">
                Don&apos;t have an account?
                <Link href="/register" className="text-primary text-decoration-none ms-1">
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoadingOverlay show={authLoading} />
    </div>
  );
}
