import React, { createContext, useContext } from 'react';
import { translations } from '@/i18n/translations.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ lang, children }) => {
  const currentLanguage = lang && translations[lang] ? lang : 'en';

  const t = (path, params = {}) => {
    const keys = path.split('.');
    let result = translations[currentLanguage];
    
    for (const key of keys) {
      if (result === undefined) break;
      result = result[key];
    }
    
    if (result === undefined) {
      result = translations['en'];
      for (const key of keys) {
        if (result === undefined) break;
        result = result[key];
      }
    }
    
    if (result === undefined) return path;
    
    let text = result;
    Object.keys(params).forEach(paramKey => {
      text = text.replace(`{${paramKey}}`, params[paramKey]);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};