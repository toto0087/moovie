import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getMovieById } from '../data/movies';

const STORAGE_KEY = 'moovi-my-list';
const DEFAULT_IDS = ['stranger-things', 'the-crown', 'demon-slayer'];

function readList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_IDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_IDS;
  } catch {
    return DEFAULT_IDS;
  }
}

function writeList(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

const MyListContext = createContext(null);

export function MyListProvider({ children }) {
  const [listIds, setListIds] = useState(readList);

  const persist = useCallback((next) => {
    setListIds(next);
    writeList(next);
  }, []);

  const isInList = useCallback((movieId) => listIds.includes(movieId), [listIds]);

  const toggleInList = useCallback(
    (movieId) => {
      persist(
        listIds.includes(movieId)
          ? listIds.filter((id) => id !== movieId)
          : [...listIds, movieId]
      );
    },
    [listIds, persist]
  );

  const listMovies = useMemo(
    () => listIds.map(getMovieById).filter(Boolean),
    [listIds]
  );

  const value = useMemo(
    () => ({
      listIds,
      listMovies,
      isInList,
      toggleInList,
    }),
    [listIds, listMovies, isInList, toggleInList]
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
