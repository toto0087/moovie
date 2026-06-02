import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'moovi-auth';

const AuthContext = createContext(null);

function readAuth() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);

  const login = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout]
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
