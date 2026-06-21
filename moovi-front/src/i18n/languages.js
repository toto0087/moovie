export const SUPPORTED_LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

export function detectDeviceLanguage() {
  const browserLang =
    (typeof navigator !== 'undefined' && (navigator.language || navigator.languages?.[0])) || 'es';
  const code = browserLang.split('-')[0].toLowerCase();
  return LANGUAGE_CODES.includes(code) ? code : 'es';
}
