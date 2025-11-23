'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingOverlay from '../../components/LoadingOverlay';
import Autocomplete from '../../components/Autocomplete';
import useAuthGuard from '../../hooks/useAuthGuard';
import { Country, UpdateUserRequest } from '../../../types/user';
import { fetchCountries, updateUser } from '../../../services/user';

export default function ProfilePage() {
  const { user, loading, refreshUser, logout } = useAuthGuard();
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState<UpdateUserRequest>({ nickname: '', phone: '', country: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        phone: user.phone || '',
        country: user.country || '',
      });
    }
  }, [user]);

  useEffect(() => {
    fetchCountries(token)
      .then((data) => {
        const mapped = (data as unknown as string[]).map((country) => ({ name: country, code: country }));
        setCountries(mapped);
      })
      .catch((error) => console.error('Failed to load countries:', error));
  }, [token]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      router.replace('/login');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateUser(currentToken, formData);
      setSuccessMessage('Profile updated successfully!');
      await refreshUser();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            Web App
          </a>
          <Header currentUser={user} />
        </div>
      </nav>

      <div className="container">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="card-title">Profile Settings</h2>
            <p className="text-secondary mb-4">Update your personal information. Note: Email address cannot be changed.</p>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={onSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={user?.email || ''}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                  <div className="form-text text-secondary">Email address cannot be changed for security reasons</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    required
                    pattern="[0-9]{10,15}"
                  />
                  <div className="form-text text-secondary">Valid phone number is required (10-15 digits)</div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label htmlFor="nickname" className="form-label">
                    Nickname *
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    className="form-control"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Enter your nickname"
                    required
                    maxLength={40}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <Autocomplete
                    label="Country *"
                    items={countries}
                    value={formData.country}
                    onChange={(value) => setFormData({ ...formData, country: value })}
                    placeholder="Start typing to search your country"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline-secondary ms-2" onClick={handleLogout}>
                Sign Out
              </button>
            </form>
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Account Information</h3>
            <p className="card-text">Your current account details</p>
            <div className="row">
              <div className="col-md-6 mb-2">
                <div className="alert alert-info">
                  <strong>Account ID</strong>
                  <div className="font-monospace text-secondary">{user?.id}</div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div className="alert alert-info">
                  <strong>Member Since</strong>
                  <div className="text-secondary">{formatDate(user?.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <LoadingOverlay show={loading || submitting} />
    </>
  );
}
