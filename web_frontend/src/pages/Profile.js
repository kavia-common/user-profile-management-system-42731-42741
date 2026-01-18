import React, { useEffect, useState } from 'react';
import { apiGetProfile, apiUpdateProfile } from '../api';
import { useAuth } from '../authContext';

// PUBLIC_INTERFACE
export default function Profile() {
  /** Profile view/edit page. */
  const { profile, setProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await apiGetProfile();
        if (!mounted) return;
        setProfile(p);
        setDisplayName(p.display_name || '');
        setBio(p.bio || '');
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load profile');
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [setProfile]);

  async function onSave(e) {
    e.preventDefault();
    setError('');
    setStatus('');
    setSaving(true);
    try {
      const updated = await apiUpdateProfile({
        display_name: displayName || null,
        bio: bio || null
      });
      setProfile(updated);
      setStatus('Saved');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="center">
      <div className="card cardWide">
        <h1 className="h1">Profile</h1>
        <p className="muted">Update your public information.</p>

        {error ? <div className="alert alertError" role="alert">{error}</div> : null}
        {status ? <div className="alert alertSuccess" role="status">{status}</div> : null}

        <form onSubmit={onSave} className="form">
          <div className="grid2">
            <div>
              <div className="label">
                Email
                <div className="readonly">{profile ? profile.email : '—'}</div>
              </div>
            </div>
            <label className="label">
              Display name
              <input className="input" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={120} />
            </label>
          </div>

          <label className="label">
            Bio
            <textarea className="input textarea" value={bio} onChange={e => setBio(e.target.value)} maxLength={1000} rows={6} />
          </label>

          <button className="btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
