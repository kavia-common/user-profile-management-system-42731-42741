import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGetProfile, getToken, setToken } from './api';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state (token + profile) and helper actions. */
  const [token, setTokenState] = useState(getToken());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const p = await apiGetProfile();
        if (mounted) setProfile(p);
      } catch {
        // Token invalid/expired -> clear it
        setToken(null);
        setTokenState(null);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      profile,
      loading,
      setProfile,
      setToken: t => {
        setToken(t);
        setTokenState(t);
      }
    }),
    [token, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
