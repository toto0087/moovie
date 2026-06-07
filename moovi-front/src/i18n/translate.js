import { locales, DEFAULT_LANGUAGE } from './locales/index.js';

export function translate(language, key, params = {}) {
  const parts = key.split('.');
  let value = locales[language] ?? locales[DEFAULT_LANGUAGE];

  for (const part of parts) {
    if (value == null) break;
    value = value[part];
  }

  if (typeof value !== 'string') {
    value = locales[DEFAULT_LANGUAGE];
    for (const part of parts) {
      if (value == null) break;
      value = value[part];
    }
  }

  if (typeof value !== 'string') return key;

  return value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    params[name] != null ? String(params[name]) : `{{${name}}}`
  );
}
