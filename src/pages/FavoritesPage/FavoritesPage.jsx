import { PageHeader } from '../../components/PageHeader/PageHeader';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { movies } from '../../data/movies';

const favorites = movies.filter((m) =>
  ['stranger-things', 'the-crown', 'peaky-blinders', 'demon-slayer'].includes(m.id)
);

export function FavoritesPage() {
  return (
    <>
      <PageHeader />
      <MovieGrid movies={favorites} />
    </>
  );
}
