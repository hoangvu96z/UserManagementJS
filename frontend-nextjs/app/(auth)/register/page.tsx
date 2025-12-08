'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../components/Toast';
import { useAuth } from '../../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setErrorMessage('');
    try {
      await register(formData);
      setToastType('success');
      setToastMessage('Registration successful!');
      setShowToast(true);
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (error: any) {
      setToastType('danger');
      setToastMessage('Registration failed. Please try again.');
      setShowToast(true);
      setErrorMessage(error?.message || 'Registration failed. Please try again.');
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
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-3">Create Account</h2>
              <p className="text-center text-secondary mb-4">Fill the form below to get started</p>

              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

              <form onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="username">
                      Username
                    </label>
                    <input
                      id="username"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="form-control"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={authLoading}>
                  {authLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="text-center mt-4">
                Already have an account?
                <Link href="/login" className="text-primary text-decoration-none ms-1">
                  Sign in
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
