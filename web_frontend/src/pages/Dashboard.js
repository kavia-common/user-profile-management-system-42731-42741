import React, { useEffect, useState } from 'react';
import { apiGetProfile, apiProtectedPing } from '../api';
import { useAuth } from '../authContext';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Post-login dashboard. */
  const { profile, setProfile } = useAuth();
  const [protectedMsg, setProtectedMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setError('');
      try {
        const p = await apiGetProfile();
        if (mounted) setProfile(p);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load profile');
      }
    }

    async function ping() {
      try {
        const res = await apiProtectedPing();
        if (mounted) setProtectedMsg(res.message);
      } catch {
        if (mounted) setProtectedMsg('');
      }
    }

    load();
    ping();
    return () => {
      mounted = false;
    };
  }, [setProfile]);

  return (
    <div className="grid">
      <div className="card">
        <h1 className="h1">Dashboard</h1>
        <p className="muted">Your account overview.</p>

        {error ? <div className="alert alertError" role="alert">{error}</div> : null}

        {profile ? (
          <div className="kv">
            <div className="kvRow"><span className="kvKey">Email</span><span className="kvVal">{profile.email}</span></div>
            <div className="kvRow"><span className="kvKey">Display name</span><span className="kvVal">{profile.display_name || '—'}</span></div>
            <div className="kvRow"><span className="kvKey">Bio</span><span className="kvVal">{profile.bio || '—'}</span></div>
          </div>
        ) : (
          <p className="muted">Loading profile…</p>
        )}
      </div>

      <div className="card">
        <h2 className="h2">Protected API</h2>
        <p className="muted">Example of a JWT-protected backend endpoint.</p>
        {protectedMsg ? <div className="alert alertInfo">{protectedMsg}</div> : <p className="muted">No message yet.</p>}
      </div>
    </div>
  );
}
