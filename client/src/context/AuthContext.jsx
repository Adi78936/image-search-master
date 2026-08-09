import { createContext, useContext, useEffect, useState } from 'react';
import { authUrl, withCreds } from '../api';

const AuthCtx = createContext({
  user: null,
  loading: false,
  login: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    withCreds('/auth/user')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          setUser(data && data._id ? data : null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (provider) => {
    if (!provider) return;
    window.location.href = authUrl(provider);
  };

  const logout = async () => {
    try {
      await withCreds('/auth/logout', { method: 'POST' });
    } catch (err) {
      // ignore errors when auth is disabled
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
