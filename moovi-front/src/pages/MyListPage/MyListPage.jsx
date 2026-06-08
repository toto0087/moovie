import { SettingsLayout } from '../../components/SettingsLayout/SettingsLayout';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { MyListItem } from '../../components/MyListItem/MyListItem';
import { useMyList } from '../../context/MyListContext';
import { useI18n } from '../../context/I18nContext';
import styles from './MyListPage.module.css';

export function MyListPage() {
  const { t } = useI18n();
  const { listMovies } = useMyList();

  return (
    <SettingsLayout
      title={t('profile.menu.lists')}
      subtitle={t('profile.menu.listsDesc')}
      backTo="/perfil"
    >
      <div className={styles.searchWrap}>
        <SearchBar placeholder={t('myList.placeholder')} />
      </div>

      {listMovies.length === 0 ? (
        <p className={styles.empty}>{t('myList.empty')}</p>
      ) : (
        <ul className={styles.list} aria-label={t('myList.aria')}>
          {listMovies.map((movie) => (
            <MyListItem key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </SettingsLayout>
  );
}
