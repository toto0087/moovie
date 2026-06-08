import { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { mapMovies } from '../utils/mapMovie';
import { filterByPlatforms } from '../utils/filterByPlatforms';
import { useUserProfile } from '../context/UserProfileContext';

const PAGE_SIZE = 10;

export function useMoviesTab(tab = 'novedades', mediaType = null, genre = null) {
  const { language } = useI18n();
  const { activePlatforms } = useUserProfile();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Track the previous filter combination to detect resets vs load-more
  const filterRef = useRef(null);
  const filterKey = `${tab}|${mediaType ?? ''}|${genre ?? ''}|${language}|${activePlatforms.join(',')}`;

  useEffect(() => {
    const isReset = filterRef.current !== filterKey;
    filterRef.current = filterKey;

    const currentPage = isReset ? 1 : page;

    if (isReset) {
      setPage(1);
      setMovies([]);
      setHasMore(false);
      setLoading(true);
    } else {
      if (currentPage === 1) setLoading(true);
      else setLoadingMore(true);
    }

    setError(null);

    let cancelled = false;
    const params = { tab, page: currentPage, limit: PAGE_SIZE, lang: language };
    if (mediaType) params.media_type = mediaType;
    if (genre) params.genre = genre;

    api
      .get('/movies', { params })
      .then(({ data }) => {
        if (cancelled) return;
        const mapped = filterByPlatforms(mapMovies(data.data), activePlatforms);
        setMovies((prev) => (isReset || currentPage === 1 ? mapped : [...prev, ...mapped]));
        setHasMore(currentPage * PAGE_SIZE < data.total);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          if (isReset || currentPage === 1) setMovies([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  const loadMore = () => {
    if (!loadingMore && hasMore) setPage((p) => p + 1);
  };

  return { movies, loading, loadingMore, error, hasMore, loadMore };
}
