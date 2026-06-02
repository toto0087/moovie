import { PageHeader } from '../../components/PageHeader/PageHeader';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { MyListItem } from '../../components/MyListItem/MyListItem';
import { useMyList } from '../../context/MyListContext';
import styles from './MyListPage.module.css';

export function MyListPage() {
  const { listMovies } = useMyList();

  return (
    <div className={styles.page}>
      <PageHeader />
      <div className={styles.searchWrap}>
        <SearchBar placeholder="Buscar en tu lista" />
      </div>

      {listMovies.length === 0 ? (
        <p className={styles.empty}>
          Tu lista está vacía. Entrá a un título y tocá &quot;Mi Lista&quot; para guardarlo acá.
        </p>
      ) : (
        <ul className={styles.list} aria-label="Mi lista">
          {listMovies.map((movie) => (
            <MyListItem key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </div>
  );
}
