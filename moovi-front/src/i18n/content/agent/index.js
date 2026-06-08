import es from './es.js';
import en from './en.js';
import fr from './fr.js';
import pt from './pt.js';
import zh from './zh.js';
import ja from './ja.js';
import { DEFAULT_LANGUAGE } from '../../locales/index.js';

const bundles = { es, en, fr, pt, zh, ja };

export function getAgentBundle(language = DEFAULT_LANGUAGE) {
  return bundles[language] ?? bundles[DEFAULT_LANGUAGE];
}
