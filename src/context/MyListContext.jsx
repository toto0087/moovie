import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const MyListContext = createContext(null);

export function MyListProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [listMovies, setListMovies] = useState([]);

  const fetchList = useCallback(async () => {
    try {
      const res = await api.get('/users/me/list');
      setListMovies(res.data);
    } catch {
      setListMovies([]);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchList();
    else setListMovies([]);
  }, [isAuthenticated, fetchList]);

  const isInList = useCallback(
    (movieId) => listMovies.some((m) => m.id === movieId),
    [listMovies],
  );

  const toggleInList = useCallback(
    async (movieId) => {
      if (isInList(movieId)) {
        // Optimistic remove
        setListMovies((prev) => prev.filter((m) => m.id !== movieId));
        try {
          await api.delete(`/users/me/list/${movieId}`);
        } catch {
          await fetchList();
        }
      } else {
        try {
          await api.post(`/users/me/list/${movieId}`);
          await fetchList();
        } catch {
          // silently fail
        }
      }
    },
    [isInList, fetchList],
  );

  const value = useMemo(
    () => ({ listMovies, isInList, toggleInList }),
    [listMovies, isInList, toggleInList],
  );

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>;
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) throw new Error('useMyList debe usarse dentro de MyListProvider');
  return context;
}
