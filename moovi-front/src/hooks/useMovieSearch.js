import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { mapMovies } from '../utils/mapMovie';
import { filterByPlatforms } from '../utils/filterByPlatforms';
import { useUserProfile } from '../context/UserProfileContext';

export function useMovieSearch(query, genre = null, debounceMs = 400) {
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

      let request;
      if (trimmed.length >= 2) {
        request = api.get('/movies/search', { params: { q: trimmed, lang: language } });
      } else if (genre) {
        request = api.get('/movies', { params: { genre, limit: 50, lang: language } });
      } else {
        request = api.get('/movies/trending', { params: { lang: language } });
      }

      request
        .then(({ data }) => {
          if (cancelled) return;
          // trending/search return array; /movies returns { data: [...] }
          const list = Array.isArray(data) ? data : (data.data ?? []);
          let mapped = filterByPlatforms(mapMovies(list), activePlatforms);
          // when text + genre both active, filter client-side by genre
          if (trimmed.length >= 2 && genre) {
            mapped = mapped.filter((m) => m.genre?.split(' · ').includes(genre));
          }
          setMovies(mapped);
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
  }, [query, genre, debounceMs, activePlatforms, language]);

  return { movies, loading, error };
}
