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
      .then(async (res) => {
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (!cancelled) {
          setUser(data && data._id ? data : null);
        }
      })
      .catch((err) => {
        console.error('Auth check error:', err);
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
