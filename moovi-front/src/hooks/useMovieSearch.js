import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { mapMovies } from '../utils/mapMovie';
import { filterByPlatforms } from '../utils/filterByPlatforms';
import { useUserProfile } from '../context/UserProfileContext';

export function useMovieSearch(query, debounceMs = 400) {
  const { language } = useI18n();
  const { activePlatforms } = useUserProfile();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const trimmed = query.trim();

    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      const request = trimmed.length >= 2
        ? api.get('/movies/search', { params: { q: trimmed, lang: language } })
        : api.get('/movies/trending', { params: { lang: language } });

      request
        .then(({ data }) => {
          if (!cancelled) {
            setMovies(filterByPlatforms(mapMovies(data), activePlatforms));
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err);
            setMovies([]);
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, debounceMs, activePlatforms, language]);

  return { movies, loading, error };
}
