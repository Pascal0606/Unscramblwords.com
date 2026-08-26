import { useState, useCallback, useRef } from 'react';

// Each dictionary — including English's own word list — is loaded on demand
// via a dynamic import(), so Vite splits it into its own chunk. A visitor's
// browser only downloads the one language's word list they actually need,
// instead of every language's dictionary on every page load. Results are
// cached in memory after the first load, so switching back and forth within
// a session doesn't re-download anything.
const dictionaryLoaders = {
  en: () => import('@/lib/EnWordsFull.js').then((m) => m.EN_WORDS_FULL),
  fr: () => import('@/lib/FrWordsFull.js').then((m) => m.FR_WORDS_FULL),
  es: () => import('@/lib/EsWordsFull.js').then((m) => m.ES_WORDS_FULL),
  de: () => import('@/lib/DeWordsFull.js').then((m) => m.DE_WORDS_FULL),
  it: () => import('@/lib/ItWordsFull.js').then((m) => m.IT_WORDS_FULL),
  tr: () => import('@/lib/TrWordsFull.js').then((m) => m.TR_WORDS_FULL),
  ru: () => import('@/lib/RuWordsFull.js').then((m) => m.RU_WORDS_FULL),
};

// Arabic is handled the same way as Polish: its verb morphology (tense
// particles as prefixes, object pronouns as suffixes) makes a genuinely
// complete word list far larger than a single small file, so it loads in
// two tiers -- ArWordsCommon.js (~81K base dictionary forms) loads first
// so the tool is usable immediately, then ArWordsBackground1-4.js
// (~2.5M grammatically-expanded forms) load in the background and merge
// in silently. See loadPolishDictionary below for the identical pattern.
const loadArabicDictionary = async (onBackgroundLoadingChange) => {
  const { AR_WORDS_COMMON_RAW } = await import('@/lib/ArWordsCommon.js');
  const common = (AR_WORDS_COMMON_RAW || '').split('\n').filter(Boolean).map((w) => w.toUpperCase());
  localDictionaryCache.ar = common;

  onBackgroundLoadingChange?.(true);
  Promise.all([
    import('@/lib/ArWordsBackground1.js'),
    import('@/lib/ArWordsBackground2.js'),
    import('@/lib/ArWordsBackground3.js'),
    import('@/lib/ArWordsBackground4.js'),
  ])
    .then(([m1, m2, m3, m4]) => {
      const background = [
        m1.AR_WORDS_BACKGROUND_1_RAW,
        m2.AR_WORDS_BACKGROUND_2_RAW,
        m3.AR_WORDS_BACKGROUND_3_RAW,
        m4.AR_WORDS_BACKGROUND_4_RAW,
      ]
        .flatMap((raw) => (raw || '').split('\n'))
        .filter(Boolean)
        .map((w) => w.toUpperCase());
      localDictionaryCache.ar = [...common, ...background];
    })
    .catch((error) => {
      console.error('Arabic background dictionary failed to load:', error);
    })
    .finally(() => {
      onBackgroundLoadingChange?.(false);
    });

  return common;
};

// Polish is handled separately from the single-file loaders above: its
// grammar is so richly inflected that a genuinely complete word list
// (~2.87M forms, ~7.5MB gzipped) is roughly 16x larger than any other
// language's dictionary here. Rather than make every Polish user wait on
// that full download before the tool becomes usable, or shrink Polish down
// to base/lemma forms only (which would make it the functionally weakest
// dictionary in the app, unable to recognise common inflected forms like
// case declensions), Polish loads in two tiers:
//   1. PlWordsCommon.js (~238K base/lemma words) loads first, same speed
//      as any other language, so the tool is usable almost immediately.
//   2. PlWordsBackground.js (~2.63M remaining inflected forms) then loads
//      in the background and merges in silently once ready.
// isBackgroundLoading (returned by the hook below) lets the UI show an
// honest "still expanding dictionary" indicator during that window, since
// a valid inflected word could otherwise be wrongly reported as invalid
// before the background tier finishes loading.
const loadPolishDictionary = async (onBackgroundLoadingChange) => {
  const { PL_WORDS_COMMON_RAW } = await import('@/lib/PlWordsCommon.js');
  const common = (PL_WORDS_COMMON_RAW || '').split('\n').filter(Boolean).map((w) => w.toUpperCase());
  localDictionaryCache.pl = common;

  onBackgroundLoadingChange?.(true);
  // The background tier is split across 4 files so each stays under
  // GitHub's 25MB web-upload limit -- all 4 are fetched in parallel and
  // merged in once every part has arrived.
  Promise.all([
    import('@/lib/PlWordsBackground1.js'),
    import('@/lib/PlWordsBackground2.js'),
    import('@/lib/PlWordsBackground3.js'),
    import('@/lib/PlWordsBackground4.js'),
  ])
    .then(([m1, m2, m3, m4]) => {
      const background = [
        m1.PL_WORDS_BACKGROUND_1_RAW,
        m2.PL_WORDS_BACKGROUND_2_RAW,
        m3.PL_WORDS_BACKGROUND_3_RAW,
        m4.PL_WORDS_BACKGROUND_4_RAW,
      ]
        .flatMap((raw) => (raw || '').split('\n'))
        .filter(Boolean)
        .map((w) => w.toUpperCase());
      localDictionaryCache.pl = [...common, ...background];
    })
    .catch((error) => {
      console.error('Polish background dictionary failed to load:', error);
      // The common-word tier stays usable even if the background tier fails.
    })
    .finally(() => {
      onBackgroundLoadingChange?.(false);
    });

  return common;
};

// Portuguese is handled the same way as Polish and Arabic: it now has a
// full grammatical expansion (conjugated/declined forms) covering both
// European and Brazilian Portuguese, built to bring it up to the same
// depth as those two languages -- so it loads in two tiers.
//   1. PtWordsCommon.js (~38K contamination-cleaned base words) loads
//      first, same speed as any other language, so the tool is usable
//      almost immediately.
//   2. PtWordsBackground1-4.js (~2.85M expanded forms) then load in the
//      background and merge in silently once ready.
// See loadPolishDictionary above for the identical pattern and
// PtWordsBackground1.js for detail on how the expansion was built/cleaned.
const loadPortugueseDictionary = async (onBackgroundLoadingChange) => {
  const { PT_WORDS_COMMON_RAW } = await import('@/lib/PtWordsCommon.js');
  const common = (PT_WORDS_COMMON_RAW || '').split('\n').filter(Boolean).map((w) => w.toUpperCase());
  localDictionaryCache.pt = common;

  onBackgroundLoadingChange?.(true);
  Promise.all([
    import('@/lib/PtWordsBackground1.js'),
    import('@/lib/PtWordsBackground2.js'),
    import('@/lib/PtWordsBackground3.js'),
    import('@/lib/PtWordsBackground4.js'),
  ])
    .then(([m1, m2, m3, m4]) => {
      const background = [
        m1.PT_WORDS_BACKGROUND_1_RAW,
        m2.PT_WORDS_BACKGROUND_2_RAW,
        m3.PT_WORDS_BACKGROUND_3_RAW,
        m4.PT_WORDS_BACKGROUND_4_RAW,
      ]
        .flatMap((raw) => (raw || '').split('\n'))
        .filter(Boolean)
        .map((w) => w.toUpperCase());
      localDictionaryCache.pt = [...common, ...background];
    })
    .catch((error) => {
      console.error('Portuguese background dictionary failed to load:', error);
    })
    .finally(() => {
      onBackgroundLoadingChange?.(false);
    });

  return common;
};

const localDictionaryCache = {};

const getLocalDictionary = async (langCode, onBackgroundLoadingChange) => {
  if (localDictionaryCache[langCode]) return localDictionaryCache[langCode];
  if (langCode === 'pl') {
    return loadPolishDictionary(onBackgroundLoadingChange);
  }
  if (langCode === 'ar') {
    return loadArabicDictionary(onBackgroundLoadingChange);
  }
  if (langCode === 'pt') {
    return loadPortugueseDictionary(onBackgroundLoadingChange);
  }
  const loader = dictionaryLoaders[langCode];
  const raw = loader ? await loader() : [];
  const words = (raw || []).map((w) => w.toUpperCase());
  localDictionaryCache[langCode] = words;
  return words;
};

export const useWordUnscrambler = (currentLanguage = 'en') => {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallbackDictionary, setIsUsingFallbackDictionary] = useState(false);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
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

      dict = await getLocalDictionary(currentLanguage, setIsBackgroundLoading);
      setIsUsingFallbackDictionary(false);

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
  }, [currentLanguage]);

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
    isBackgroundLoading,
    unscramble,
    reset,
    filters,
    updateFilters,
    clearFilters
  };
};
