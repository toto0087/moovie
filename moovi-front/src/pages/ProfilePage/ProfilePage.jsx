import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationsContext';
import {
  FiBell,
  FiBookmark,
  FiChevronRight,
  FiHelpCircle,
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { useI18n } from '../../context/I18nContext';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { profile } = useUserProfile();

  const planLabel = profile.plan === 'premium' ? t('plan.premium') : t('plan.free');

  const menuGroups = useMemo(
    () => [
      {
        title: t('profile.menu.content'),
        items: [
          {
            label: t('profile.menu.lists'),
            to: '/mi-lista',
            icon: FiBookmark,
            description: t('profile.menu.listsDesc'),
          },
        ],
      },
      {
        title: t('profile.menu.account'),
        items: [
          {
            label: t('profile.menu.settings'),
            to: '/perfil/configuracion',
            icon: FiSettings,
            description: t('profile.menu.settingsDesc'),
          },
          {
            label: t('profile.menu.accountPage'),
            to: '/perfil/cuenta',
            icon: FiUser,
            description: t('profile.menu.accountDesc'),
          },
        ],
      },
      {
        title: t('profile.menu.support'),
        items: [
          {
            label: t('profile.menu.help'),
            to: '/perfil/ayuda',
            icon: FiHelpCircle,
            description: t('profile.menu.helpDesc'),
          },
        ],
      },
    ],
    [t]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>{t('profile.title')}</h1>
        <div className={styles.headerActions}>
          <Link
            to="/notificaciones"
            className={styles.iconBtn}
            aria-label={
              unreadCount > 0
                ? t('profile.notificationsUnread', { count: unreadCount })
                : t('profile.notifications')
            }
          >
            <FiBell aria-hidden />
            {unreadCount > 0 && <span className={styles.bellDot} aria-hidden />}
          </Link>
        </div>
      </header>

      <section className={styles.profileCard} aria-label={t('profile.userInfo')}>
        <div className={styles.avatarWrap}>
          <img
            src={profile.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name || 'U')}
            alt=""
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.name}>{profile.name}</h2>
          <p className={styles.email}>{profile.email}</p>
          <span className={styles.planBadge}>{planLabel}</span>
        </div>
      </section>

      <div className={styles.menuGroups}>
        {menuGroups.map((group) => (
          <section key={group.title} className={styles.menuGroup}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <nav className={styles.menuCard} aria-label={group.title}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to} className={styles.menuItem}>
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
        {t('profile.logout')}
      </button>
    </div>
  );
}
