import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { translate } from '../i18n/translate';
import { LANGUAGE_CODES } from '../i18n/languages';
import { useAppSettings } from './AppSettingsContext';

const I18nContext = createContext(null);

function normalizeLanguage(code) {
  return LANGUAGE_CODES.includes(code) ? code : 'es';
}

export function I18nProvider({ children }) {
  const { settings } = useAppSettings();
  const language = normalizeLanguage(settings.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key, params) => translate(language, key, params),
    [language]
  );

  const value = useMemo(() => ({ language, t }), [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n debe usarse dentro de I18nProvider');
  }
  return context;
}
