import { Link, useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import styles from './ProfilePage.module.css';

const menuItems = [
  { label: 'LISTAS', to: '/mi-lista' },
  { label: 'CONFIGURACION', to: '#' },
  { label: 'CUENTA', to: '#' },
  { label: 'AYUDA', to: '#' },
];

export function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.bellBtn} aria-label="Notificaciones">
          <FiBell />
        </button>
      </div>

      <div className={styles.avatarWrap}>
        <img
          src="https://images.unsplash.com/photo-1534809027765-8fe8317e8a58?w=200&h=200&fit=crop"
          alt="Avatar de perfil"
          className={styles.avatar}
        />
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <Link key={item.label} to={item.to} className={styles.menuItem}>
            {item.label}
          </Link>
        ))}
      </nav>

      <button type="button" className={styles.logout} onClick={() => navigate('/sign-in')}>
        CERRAR SESION
      </button>
    </div>
  );
}
