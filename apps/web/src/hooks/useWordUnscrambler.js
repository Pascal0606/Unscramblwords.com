import { useState, useCallback, useRef } from 'react';
import { ENABLE_WORDS, NWL_WORDS, CSW_WORDS } from '@/lib/dictionaries.js';

// Each non-English dictionary is loaded on demand via a dynamic import(),
// so Vite splits it into its own chunk. A visitor's browser only downloads
// the one language's word list they actually select, instead of every
// language's dictionary on every page load. Results are cached in memory
// after the first load for that language, so switching back and forth
// within a session doesn't re-download anything.
const dictionaryLoaders = {
  fr: () => import('@/lib/FrWordsFull.js').then((m) => m.FR_WORDS_FULL),
  es: () => import('@/lib/EsWordsFull.js').then((m) => m.ES_WORDS_FULL),
  de: () => import('@/lib/DeWordsFull.js').then((m) => m.DE_WORDS_FULL),
  pt: () => import('@/lib/PtWordsFull.js').then((m) => m.PT_WORDS_FULL),
  it: () => import('@/lib/ItWordsFull.js').then((m) => m.IT_WORDS_FULL),
  tr: () => import('@/lib/TrWordsFull.js').then((m) => m.TR_WORDS_FULL),
  ru: () => import('@/lib/RuWordsFull.js').then((m) => m.RU_WORDS_FULL),
  zh: () => import('@/lib/languageDictionaries3.js').then((m) => m.ZH_WORDS),
  ar: () => import('@/lib/languageDictionaries3.js').then((m) => m.AR_WORDS),
};

const localDictionaryCache = {};

const getLocalDictionary = async (langCode) => {
  if (localDictionaryCache[langCode]) return localDictionaryCache[langCode];
  const loader = dictionaryLoaders[langCode];
  const raw = loader ? await loader() : [];
  const words = (raw || []).map((w) => w.toUpperCase());
  localDictionaryCache[langCode] = words;
  return words;
};

export const useWordUnscrambler = (dictionary = 'ENABLE', currentLanguage = 'en') => {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallbackDictionary, setIsUsingFallbackDictionary] = useState(false);
  const [filters, setFilters] = useState({
    startsWith: '',
    endsWith: '',
    contains: '',
    requiredLetter: '',
    wordLength: ''
  });

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const unscramble = useCallback(async (inputLetters) => {
    setIsLoading(true);

    try {
      let dict = [];

      if (currentLanguage !== 'en') {
        dict = await getLocalDictionary(currentLanguage);
        setIsUsingFallbackDictionary(false);
      } else {
        setIsUsingFallbackDictionary(false);
        if (dictionary === 'NWL') dict = NWL_WORDS || [];
        else if (dictionary === 'CSW') dict = CSW_WORDS || [];
        else dict = ENABLE_WORDS || [];
      }

      const inputUpper = inputLetters.toUpperCase();
      const currentFilters = filtersRef.current;

      let results = dict.filter(word => {
        let tempInput = inputUpper;
        for (let char of word.toUpperCase()) {
          if (tempInput.includes(char)) {
            tempInput = tempInput.replace(char, '');
          } else {
            return false;
          }
        }
        return true;
      });

      if (currentFilters.startsWith) {
        results = results.filter(w => w.toUpperCase().startsWith(currentFilters.startsWith.toUpperCase()));
      }
      if (currentFilters.endsWith) {
        results = results.filter(w => w.toUpperCase().endsWith(currentFilters.endsWith.toUpperCase()));
      }
      if (currentFilters.contains) {
        results = results.filter(w => w.toUpperCase().includes(currentFilters.contains.toUpperCase()));
      }
      if (currentFilters.requiredLetter) {
        results = results.filter(w => w.toUpperCase().includes(currentFilters.requiredLetter.toUpperCase()));
      }
      if (currentFilters.wordLength) {
        results = results.filter(w => w.length === parseInt(currentFilters.wordLength));
      }

      setWords(results.map(w => w.toUpperCase()));
    } catch (error) {
      console.error('Dictionary error:', error);
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  }, [dictionary, currentLanguage]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      startsWith: '',
      endsWith: '',
      contains: '',
      requiredLetter: '',
      wordLength: ''
    });
  }, []);

  const reset = useCallback(() => {
    setWords([]);
    clearFilters();
  }, [clearFilters]);

  return {
    words,
    isLoading,
    isUsingFallbackDictionary,
    unscramble,
    reset,
    filters,
    updateFilters,
    clearFilters
  };
};
