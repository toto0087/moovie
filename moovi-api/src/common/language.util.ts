export const APP_TO_TMDB_LANG: Record<string, string> = {
  es: 'es-AR',
  en: 'en-US',
  fr: 'fr-FR',
  pt: 'pt-BR',
  zh: 'zh-CN',
  ja: 'ja-JP',
};

export const DEFAULT_CONTENT_LANG = 'es';

export function resolveTmdbLanguage(appLang?: string): string | null {
  if (!appLang || appLang === DEFAULT_CONTENT_LANG) return null;
  return APP_TO_TMDB_LANG[appLang] ?? null;
}
