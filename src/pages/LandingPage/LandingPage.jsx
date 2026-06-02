import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo/Logo';
import { movies } from '../../data/movies';
import styles from './LandingPage.module.css';

const posterTiles = [...movies, ...movies, ...movies].map((m) => m.poster);

export function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.posterStage} aria-hidden>
        <div className={styles.posterGrid}>
          {posterTiles.map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" className={styles.poster} loading="lazy" />
          ))}
        </div>
      </div>

      <div className={styles.overlay} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <div className={styles.content}>
        <Logo size="xl" className={styles.logo} />

        <div className={styles.bottom}>
        <h1 className={styles.headline}>
          <span className={`${styles.line} ${styles.reveal}`} style={{ animationDelay: '0.15s' }}>
            <span className={styles.brand}>Moovi</span>
            <span className={styles.lineText}>
              {' '}
              no solo te dice{' '}
              <span className={styles.softWord}>qué ver</span>…
            </span>
          </span>

          <span
            className={`${styles.lineHighlight} ${styles.reveal}`}
            style={{ animationDelay: '0.35s' }}
          >
            <span className={styles.prefix}>te dice</span>
            <span className={styles.emphasis}>dónde verlo</span>
            <span className={styles.connector}>en</span>
            <span className={styles.strongWord}>segundos</span>.
          </span>
        </h1>

        <div className={`${styles.actions} ${styles.reveal}`} style={{ animationDelay: '0.55s' }}>
          <Link to="/join-us" className={styles.joinBtn}>
            Join Us
          </Link>
          <Link to="/sign-in" className={styles.signInBtn}>
            Sign In
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
