import { translations } from './translations.js';
import { detectLanguage } from './languageDetection.js';

export const i18n = {
  translations,
  detectLanguage,
  getSupportedLanguages: () => Object.keys(translations)
};

export default i18n;