import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { MovieCarousel } from '../../components/MovieCarousel/MovieCarousel';
import { ContentTabs } from '../../components/ContentTabs/ContentTabs';
import { MovieGrid } from '../../components/MovieGrid/MovieGrid';
import api from '../../services/api';
import styles from './HomePage.module.css';

export function HomePage({ variant = 'home' }) {
  const [activeTab, setActiveTab] = useState('novedades');
  const [popular, setPopular] = useState([]);
  const [tabbed, setTabbed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/movies/trending')
      .then((res) => setPopular(res.data))
      .catch(() => setPopular([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/movies', { params: { tab: activeTab, page: 1, limit: 20 } })
      .then((res) => setTabbed(res.data.data ?? res.data))
      .catch(() => setTabbed([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  if (variant === 'tabs') {
    return (
      <div className={styles.page}>
        <PageHeader />
        <ContentTabs active={activeTab} onChange={setActiveTab} />
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Cargando...</p>
        ) : (
          <MovieGrid movies={tabbed} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader />
      <section className={styles.section} aria-labelledby="popular-heading">
        <h2 id="popular-heading" className={styles.sectionTitle}>
          Populares
        </h2>
        <MovieCarousel movies={popular} fill />
      </section>
    </div>
  );
}
