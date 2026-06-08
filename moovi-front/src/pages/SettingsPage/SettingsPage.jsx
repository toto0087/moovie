import { useState } from 'react';
import { SettingsLayout } from '../../components/SettingsLayout/SettingsLayout';
import { SettingsSection } from '../../components/SettingsSection/SettingsSection';
import { SettingsRow } from '../../components/SettingsRow/SettingsRow';
import { SettingsToggle } from '../../components/SettingsToggle/SettingsToggle';
import { useAppSettings } from '../../context/AppSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { clearSearchHistory } from '../../utils/searchHistory';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { t } = useI18n();
  const { isDark, setTheme } = useTheme();
  const { settings, updateSetting } = useAppSettings();
  const [historyCleared, setHistoryCleared] = useState(false);

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistoryCleared(true);
    setTimeout(() => setHistoryCleared(false), 2500);
  };

  return (
    <SettingsLayout title={t('settings.title')} subtitle={t('settings.subtitle')}>
      <SettingsSection
        title={t('settings.notifications')}
        description={t('settings.notificationsDesc')}
      >
        <SettingsRow label={t('settings.notifyNew')} description={t('settings.notifyNewDesc')}>
          <SettingsToggle
            checked={settings.notifyNewContent}
            onChange={(v) => updateSetting('notifyNewContent', v)}
            label={t('settings.notifyNew')}
          />
        </SettingsRow>
        <SettingsRow label={t('settings.notifyTrending')} description={t('settings.notifyTrendingDesc')}>
          <SettingsToggle
            checked={settings.notifyTrending}
            onChange={(v) => updateSetting('notifyTrending', v)}
            label={t('settings.notifyTrending')}
          />
        </SettingsRow>
        <SettingsRow label={t('settings.notifyList')} description={t('settings.notifyListDesc')}>
          <SettingsToggle
            checked={settings.notifyListUpdates}
            onChange={(v) => updateSetting('notifyListUpdates', v)}
            label={t('settings.notifyList')}
          />
        </SettingsRow>
        <SettingsRow label={t('settings.notifyAgent')} description={t('settings.notifyAgentDesc')}>
          <SettingsToggle
            checked={settings.notifyAgentResults}
            onChange={(v) => updateSetting('notifyAgentResults', v)}
            label={t('settings.notifyAgent')}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t('settings.searchCatalog')}>
        <SettingsRow label={t('settings.saveHistory')} description={t('settings.saveHistoryDesc')}>
          <SettingsToggle
            checked={settings.saveSearchHistory}
            onChange={(v) => updateSetting('saveSearchHistory', v)}
            label={t('settings.saveHistory')}
          />
        </SettingsRow>
        <SettingsRow label={t('settings.onlyPlatforms')} description={t('settings.onlyPlatformsDesc')}>
          <SettingsToggle
            checked={settings.onlyMyPlatforms}
            onChange={(v) => updateSetting('onlyMyPlatforms', v)}
            label={t('settings.onlyPlatforms')}
          />
        </SettingsRow>
        <SettingsRow
          label={t('settings.clearHistory')}
          description={historyCleared ? t('settings.clearHistoryDone') : t('settings.clearHistoryDesc')}
          onClick={handleClearHistory}
        />
      </SettingsSection>

      <SettingsSection title={t('settings.appearance')}>
        <SettingsRow label={t('settings.darkMode')} description={t('settings.darkModeDesc')}>
          <SettingsToggle
            checked={isDark}
            onChange={(on) => setTheme(on ? 'dark' : 'light')}
            label={t('settings.darkMode')}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t('settings.language')}>
        <div className={styles.languageField}>
          <label htmlFor="settings-language" className={styles.fieldLabel}>
            {t('settings.languageAria')}
          </label>
          <select
            id="settings-language"
            className={styles.select}
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
}
