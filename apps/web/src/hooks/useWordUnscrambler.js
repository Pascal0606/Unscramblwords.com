import { useState, useCallback, useRef } from 'react';
import { ENABLE_WORDS, NWL_WORDS, CSW_WORDS } from '@/lib/dictionaries.js';
import { getDictionaryForLanguage } from '@/lib/languageDictionaries3.js';

// Non-English dictionaries are read directly from the bundled local word
// lists (see languageDictionaries3.js / FrWordsFull.js). Earlier versions of
// this hook tried to live-fetch full dictionaries from GitHub through public
// CORS proxies at search time, falling back to a local list only if all
// three proxies failed. That made every non-English search depend on the
// uptime of third-party proxy services, which was unreliable and caused
// long load times or empty results. Local lists are now the single source
// of truth, so results are instant and don't depend on any network call.
const localDictionaryCache = {};

const getLocalDictionary = (langCode) => {
  if (localDictionaryCache[langCode]) return localDictionaryCache[langCode];
  const words = (getDictionaryForLanguage(langCode) || []).map((w) => w.toUpperCase());
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
        dict = getLocalDictionary(currentLanguage);
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
