'use client';

import Link from 'next/link';
import { User } from '../../types/user';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentUser: User | null;
}

export default function Header({ currentUser }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <div className="d-flex align-items-center ms-auto gap-3">
      <span className="text-secondary">Welcome, {currentUser?.nickname}</span>
      <Link className="nav-link" href="/dashboard">
        Home
      </Link>
      <Link className="nav-link" href="/profile">
        Profile Settings
      </Link>
      <button className="btn btn-outline-secondary" onClick={logout}>
        Sign Out
      </button>
    </div>
  );
}
