import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { LANGUAGE_CODES } from '../i18n/languages';

const STORAGE_KEY = 'moovi-app-settings';

function normalizeLanguage(code) {
  return LANGUAGE_CODES.includes(code) ? code : 'es';
}

export const DEFAULT_SETTINGS = {
  notifyNewContent: true,
  notifyTrending: true,
  notifyListUpdates: true,
  notifyAgentResults: true,
  saveSearchHistory: true,
  onlyMyPlatforms: false,
  language: 'es',
};

function readSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    parsed.language = normalizeLanguage(parsed.language);
    return parsed;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(readSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        [key]: key === 'language' ? normalizeLanguage(value) : value,
      };
      writeSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ settings, updateSetting }),
    [settings, updateSetting]
  );

  return (
    <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings debe usarse dentro de AppSettingsProvider');
  }
  return context;
}
