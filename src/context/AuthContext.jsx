import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Rehydrate session from stored JWT on mount
  useEffect(() => {
    const token = localStorage.getItem('moovi-token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('moovi-token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('moovi-token', res.data.access_token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  }, []);

  const register = useCallback(async (email, password, name, country) => {
    const res = await api.post('/auth/register', { email, password, name, country });
    localStorage.setItem('moovi-token', res.data.access_token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('moovi-token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, loading, login, register, logout }),
    [isAuthenticated, user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
