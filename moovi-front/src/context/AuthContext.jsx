import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistSession = useCallback((accessToken, userData) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get('/users/me');
    setUser({
      id: data.id,
      email: data.email,
      name: data.name,
      plan: data.plan,
      avatar_url: data.avatar_url,
    });
    return data;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/users/me')
      .then(({ data }) =>
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          plan: data.plan,
          avatar_url: data.avatar_url,
        })
      )
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, [clearSession]);

  const login = useCallback(
    async (email, password) => {
      setError(null);
      const { data } = await api.post('/auth/login', { email, password });
      persistSession(data.access_token, data.user);
      return data.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async ({ email, password, name, country }) => {
      setError(null);
      const { data } = await api.post('/auth/register', { email, password, name, country });
      persistSession(data.access_token, data.user);
      return data.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      setError,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, error, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
