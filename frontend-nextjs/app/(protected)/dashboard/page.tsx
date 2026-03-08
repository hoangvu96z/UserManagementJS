'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingOverlay from '../../components/LoadingOverlay';
import useAuthGuard from '../../hooks/useAuthGuard';
import { useAuth } from '../../../context/AuthContext';

export default function DashboardPage() {
  const { user, loading } = useAuthGuard();
  const { logout } = useAuth();
  const router = useRouter();

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
          <span className="navbar-brand fw-bold">Web App</span>
          <Header currentUser={user} />
        </div>
      </nav>

      <div className="container">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="card-title">Welcome to Your Dashboard</h2>
            <p className="text-secondary mb-4">Manage your account and personal information</p>

            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="alert alert-primary mb-0">Account Information</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="alert alert-success mb-0">
                      Account Status: <span className="text-success fw-bold">{user?.createdAt ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card dashboard-card mt-1">
                  <div className="card-body">
                    <p>Your current account details</p>
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>Account ID</strong>
                        <div style={{ fontFamily: 'monospace', color: '#666' }}>{user?.id}</div>
                      </div>
                      <div className="info-item">
                        <strong>Member Since</strong>
                        <div style={{ color: '#666' }}>{formatDate(user?.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h3 className="card-title">Quick Actions</h3>
                        <p className="card-text">Common tasks you can perform</p>
                        <Link href="/profile" className="btn btn-primary">
                          Update Profile
                        </Link>
                        <div style={{ marginTop: '10px', fontSize: 14, color: '#666' }}>
                          Change your personal information
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h3 className="card-title">Account Security</h3>
                        <p className="card-text">Manage your account security</p>
                        <button className="btn btn-danger" onClick={handleLogout}>
                          Sign Out
                        </button>
                        <div style={{ marginTop: '10px', fontSize: 14, color: '#666' }}>
                          Securely log out of your account
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
      <LoadingOverlay show={loading} />
    </>
  );
}
