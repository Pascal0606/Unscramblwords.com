import { useLanguage as useLanguageContext } from '@/context/LanguageContext.jsx';

export const useLanguage = () => {
  return useLanguageContext();
};