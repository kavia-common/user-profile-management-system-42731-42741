import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';

// PUBLIC_INTERFACE
export default function RequireAuth({ children }) {
  /** Redirects to login if user is not authenticated. */
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="card">
        <h2 className="h2">Loading…</h2>
        <p className="muted">Checking your session.</p>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
