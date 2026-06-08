import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { mapMovies } from '../utils/mapMovie';
import { useAuth } from './AuthContext';
import { useI18n } from './I18nContext';

const MyListContext = createContext(null);

export function MyListProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { language } = useI18n();
  const [listMovies, setListMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshList = useCallback(async () => {
    if (!isAuthenticated) {
      setListMovies([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get('/users/me/list', { params: { lang: language } });
      setListMovies(mapMovies(data));
    } catch {
      setListMovies([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, language]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const listIds = useMemo(() => listMovies.map((m) => m.id), [listMovies]);

  const isInList = useCallback(
    (movieId) => listIds.some((id) => String(id) === String(movieId)),
    [listIds]
  );

  const toggleInList = useCallback(
    async (movieId) => {
      if (!isAuthenticated) return;

      const inList = isInList(movieId);
      const optimistic = inList
        ? listMovies.filter((m) => String(m.id) !== String(movieId))
        : listMovies;

      if (inList) {
        setListMovies(optimistic);
        try {
          await api.delete(`/users/me/list/${movieId}`);
        } catch {
          await refreshList();
        }
      } else {
        try {
          await api.post(`/users/me/list/${movieId}`);
          await refreshList();
        } catch {
          await refreshList();
        }
      }
    },
    [isAuthenticated, isInList, listMovies, refreshList]
  );

  const value = useMemo(
    () => ({
      listIds,
      listMovies,
      loading,
      isInList,
      toggleInList,
      refreshList,
    }),
    [listIds, listMovies, loading, isInList, toggleInList, refreshList]
  );

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>;
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList debe usarse dentro de MyListProvider');
  }
  return context;
}
