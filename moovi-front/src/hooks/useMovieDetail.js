import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { mapMovie } from '../utils/mapMovie';

export function useMovieDetail(id) {
  const { language } = useI18n();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setMovie(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get(`/movies/${id}`, { params: { lang: language } })
      .then(({ data }) => {
        if (!cancelled) setMovie(mapMovie(data));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setMovie(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, language]);

  return { movie, loading, error };
}
