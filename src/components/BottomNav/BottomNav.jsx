import { NavLink } from 'react-router-dom';
import { FiHome, FiSearch, FiStar, FiUser } from 'react-icons/fi';
import styles from './BottomNav.module.css';

const HOME_PATHS = ['/home', '/novedades'];
const PROFILE_PATHS = ['/perfil', '/mi-lista'];

const tabs = [
  { to: '/home', label: 'Inicio', icon: FiHome },
  { to: '/buscar', label: 'Buscar', icon: FiSearch },
  { to: '/favoritos', label: 'Favoritos', icon: FiStar },
  { to: '/perfil', label: 'Perfil', icon: FiUser },
];

function isHomeActive({ pathname }) {
  return HOME_PATHS.includes(pathname) || pathname.startsWith('/titulo/');
}

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to !== '/home'}
          className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
          isActive={
            to === '/home'
              ? isHomeActive
              : to === '/perfil'
                ? ({ pathname }) => PROFILE_PATHS.includes(pathname)
                : undefined
          }
        >
          <Icon className={styles.icon} aria-hidden />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
