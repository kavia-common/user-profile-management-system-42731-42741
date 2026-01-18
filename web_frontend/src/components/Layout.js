import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { apiLogout } from '../api';
import { useAuth } from '../authContext';

// PUBLIC_INTERFACE
export default function Layout({ children }) {
  /** App shell with header/nav and responsive layout. */
  const { token, profile, setToken, setProfile } = useAuth();

  async function onLogout() {
    await apiLogout();
    setToken(null);
    setProfile(null);
  }

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="topBarInner">
          <Link to="/" className="brand">
            <span className="brandMark" aria-hidden="true">UP</span>
            <span className="brandText">User Profiles</span>
          </Link>

          <nav className="navLinks" aria-label="Primary navigation">
            {!token ? (
              <>
                <NavLink to="/login" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>Login</NavLink>
                <NavLink to="/register" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>Register</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>Profile</NavLink>
                <button className="btn btnSecondary" onClick={onLogout}>Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="content">
        <div className="container">
          {token && profile ? (
            <div className="welcomePill">
              Signed in as <strong>{profile.display_name || profile.email}</strong>
            </div>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}
