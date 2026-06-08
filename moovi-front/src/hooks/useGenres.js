import { useEffect, useState } from 'react';
import api from '../services/api';

export function useGenres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    api.get('/movies/genres')
      .then(({ data }) => setGenres(data))
      .catch(() => setGenres([]));
  }, []);

  return genres;
}
