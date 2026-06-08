import { NavLink } from 'react-router-dom';
import { FiHome, FiSearch, FiUser, FiGrid } from 'react-icons/fi';
import { FlameIcon } from '../icons/FlameIcon';
import { useI18n } from '../../context/I18nContext';
import styles from './BottomNav.module.css';

const HOME_PATHS = ['/home'];
const PROFILE_PATHS = ['/perfil', '/mi-lista'];

const TAB_KEYS = [
  { to: '/home', labelKey: 'nav.home', icon: FiHome },
  { to: '/novedades', labelKey: 'nav.catalog', icon: FiGrid },
  { to: '/buscar', labelKey: 'nav.search', icon: FiSearch },
  { to: '/tendencia', labelKey: 'nav.trending', icon: FlameIcon },
  { to: '/perfil', labelKey: 'nav.profile', icon: FiUser },
];

function isHomeActive({ pathname }) {
  return HOME_PATHS.includes(pathname) || pathname.startsWith('/titulo/');
}

export function BottomNav() {
  const { t } = useI18n();

  return (
    <nav className={styles.nav} aria-label={t('nav.main')}>
      {TAB_KEYS.map(({ to, labelKey, icon: Icon }) => (
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
          <span className={styles.label}>{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
