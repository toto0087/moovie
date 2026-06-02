import { Link, useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiBookmark,
  FiChevronRight,
  FiHelpCircle,
  FiLogOut,
  FiMoon,
  FiSettings,
  FiSun,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './ProfilePage.module.css';

const MENU_GROUPS = [
  {
    title: 'Mi contenido',
    items: [
      { label: 'Listas', to: '/mi-lista', icon: FiBookmark, description: 'Lo que guardaste para ver' },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      { label: 'Configuración', to: '#', icon: FiSettings, description: 'Preferencias y notificaciones' },
      { label: 'Cuenta', to: '#', icon: FiUser, description: 'Datos personales y plan' },
    ],
  },
  {
    title: 'Soporte',
    items: [
      { label: 'Ayuda', to: '#', icon: FiHelpCircle, description: 'Preguntas frecuentes y contacto' },
    ],
  },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Perfil</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {isDark ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Notificaciones">
            <FiBell aria-hidden />
            <span className={styles.bellDot} aria-hidden />
          </button>
        </div>
      </header>

      <section className={styles.profileCard} aria-label="Información del usuario">
        <div className={styles.avatarWrap}>
          <img
            src="https://images.unsplash.com/photo-1534809027765-8fe8317e8a58?w=200&h=200&fit=crop"
            alt=""
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.name}>María González</h2>
          <p className={styles.email}>maria.gonzalez@email.com</p>
          <span className={styles.planBadge}>Plan Premium</span>
        </div>
      </section>

      <div className={styles.menuGroups}>
        {MENU_GROUPS.map((group) => (
          <section key={group.title} className={styles.menuGroup}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <nav className={styles.menuCard} aria-label={group.title}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} to={item.to} className={styles.menuItem}>
                    <span className={styles.menuIcon} aria-hidden>
                      <Icon />
                    </span>
                    <span className={styles.menuText}>
                      <span className={styles.menuLabel}>{item.label}</span>
                      <span className={styles.menuDesc}>{item.description}</span>
                    </span>
                    <FiChevronRight className={styles.menuChevron} aria-hidden />
                  </Link>
                );
              })}
            </nav>
          </section>
        ))}
      </div>

      <button type="button" className={styles.logout} onClick={handleLogout}>
        <FiLogOut aria-hidden />
        Cerrar sesión
      </button>
    </div>
  );
}
