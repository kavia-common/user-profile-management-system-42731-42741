import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRegister } from '../api';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration page. */
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiRegister({
        email,
        password,
        display_name: displayName || undefined,
        bio: bio || undefined
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="center">
      <div className="card cardNarrow">
        <h1 className="h1">Create your account</h1>
        <p className="muted">Get started in under a minute.</p>

        {error ? <div className="alert alertError" role="alert">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Email
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>

          <label className="label">
            Password <span className="muted">(min 8 chars)</span>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </label>

          <label className="label">
            Display name <span className="muted">(optional)</span>
            <input className="input" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={120} />
          </label>

          <label className="label">
            Bio <span className="muted">(optional)</span>
            <textarea className="input textarea" value={bio} onChange={e => setBio(e.target.value)} maxLength={1000} rows={4} />
          </label>

          <button className="btn" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
