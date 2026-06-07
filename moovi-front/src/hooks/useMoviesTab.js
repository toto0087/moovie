import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { mapMovies } from '../utils/mapMovie';
import { filterByPlatforms } from '../utils/filterByPlatforms';
import { useUserProfile } from '../context/UserProfileContext';

export function useMoviesTab(tab = 'novedades') {
  const { language } = useI18n();
  const { activePlatforms } = useUserProfile();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get('/movies', { params: { tab, page: 1, limit: 50, lang: language } })
      .then(({ data }) => {
        if (!cancelled) {
          setMovies(filterByPlatforms(mapMovies(data.data), activePlatforms));
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

    return () => {
      cancelled = true;
    };
  }, [tab, activePlatforms, language]);

  return { movies, loading, error };
}
