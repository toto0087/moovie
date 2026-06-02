import { PageHeader } from '../../components/PageHeader/PageHeader';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import { popularNow } from '../../data/movies';
import styles from './FavoritesPage.module.css';

export function FavoritesPage() {
  return (
    <div className={styles.page}>
      <PageHeader />
      <section className={styles.section} aria-labelledby="tendencia-heading">
        <h2 id="tendencia-heading" className={styles.title}>
          Tendencia
        </h2>
        <p className={styles.subtitle}>Lo que más pegó hoy en Netflix, HBO Max y Disney+</p>
        <MovieGrid movies={popularNow} />
      </section>
    </div>
  );
}
