export const detectLanguage = () => {
  const supportedLanguages = ['en', 'es', 'fr', 'de', 'pt', 'it', 'tr', 'ru', 'zh', 'ar'];
  
  if (typeof navigator === 'undefined') return 'en';
  
  const browserLangs = navigator.languages || [navigator.language];
  
  for (const lang of browserLangs) {
    if (!lang) continue;
    const shortLang = lang.split('-')[0].toLowerCase();
    if (supportedLanguages.includes(shortLang)) {
      return shortLang;
    }
  }
  
  return 'en';
};