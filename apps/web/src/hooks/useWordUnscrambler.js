import { useState, useCallback, useRef } from 'react';
import { ENABLE_WORDS, NWL_WORDS, CSW_WORDS } from '@/lib/dictionaries.js';
import { getDictionaryForLanguage } from '@/lib/languageDictionaries3.js';

const DICTIONARY_URLS = {
  es: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/es/es_50k.txt',
  fr: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/fr/fr_50k.txt',
  de: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/de/de_50k.txt',
  pt: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/pt_br/pt_br_50k.txt',
  it: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/it/it_50k.txt',
  tr: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/tr/tr_50k.txt',
  ru: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/ru/ru_50k.txt',
  zh: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/zh/zh_50k.txt',
  ar: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/ar/ar_50k.txt',
};

const cache = {};

// Tracks whether the last dictionary load for a language fell back to the
// small local list (rather than the full live-fetched one), so the UI can
// tell the user if it wants to.
const usedFallback = {};

const fetchDictionary = async (langCode) => {
  if (cache[langCode]) return cache[langCode];
  const url = DICTIONARY_URLS[langCode];
  if (!url) return [];

  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  let text = null;
  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        text = await response.text();
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!text) {
    // All three proxies failed — fall back to the small local word list
    // already bundled in the app, rather than returning nothing.
    const fallback = getDictionaryForLanguage(langCode) || [];
    const upperFallback = fallback.map((w) => w.toUpperCase());
    usedFallback[langCode] = upperFallback.length > 0;
    // Don't cache a fallback result — keep retrying the live fetch on
    // future searches in case the proxies recover.
    return upperFallback;
  }

  const words = text
    .split('\n')
    .slice(0, 10000)
    .map(line => line.split(' ')[0].trim().toUpperCase())
    .filter(word => word.length >= 2 && word.length <= 15 && /^[A-ZÁÉÍÓÚÀÂÆÇÈÊËÎÏÔŒÙÛÜŸÄÖÜSS\u0400-\u04FF\u4E00-\u9FFF\u0600-\u06FF]+$/i.test(word));

  usedFallback[langCode] = false;
  cache[langCode] = words;
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
        dict = await fetchDictionary(currentLanguage);
        console.log('DICT DEBUG:', currentLanguage, dict.length, dict.slice(0, 10));
        setIsUsingFallbackDictionary(!!usedFallback[currentLanguage]);
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
      console.error('Dictionary fetch error:', error);
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