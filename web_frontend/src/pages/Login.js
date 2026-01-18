import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiLogin } from '../api';
import { useAuth } from '../authContext';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login page. */
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiLogin({ email, password });
      setToken(data.access_token);
      const next = (location.state && location.state.from) || '/dashboard';
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="center">
      <div className="card cardNarrow">
        <h1 className="h1">Welcome back</h1>
        <p className="muted">Sign in to manage your profile.</p>

        {error ? <div className="alert alertError" role="alert">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Email
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>

          <label className="label">
            Password
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>

          <button className="btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
