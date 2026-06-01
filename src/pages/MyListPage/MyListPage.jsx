import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { getMovieById } from '../../data/movies';
import styles from './MyListPage.module.css';

const listIds = ['stranger-things', 'the-crown', 'demon-slayer'];

export function MyListPage() {
  const listMovies = listIds.map(getMovieById).filter(Boolean);

  return (
    <div className={styles.page}>
      <PageHeader />
      <div className={styles.searchWrap}>
        <SearchBar />
      </div>
      <div className={styles.carousel}>
        {listMovies.map((movie) => (
          <Link key={movie.id} to={`/titulo/${movie.id}`} className={styles.carouselCard}>
            <img src={movie.poster} alt={movie.title} />
          </Link>
        ))}
      </div>
    </div>
  );
}
