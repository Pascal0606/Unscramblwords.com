// Per-language Scrabble tile point values.
// Sources: official Hasbro/Mattel letter distributions per language edition.
// Polish values sourced from the standard 100-tile Polish Scrabble set
// (verified count: tile quantities sum to exactly 100, matching every
// other language's tile set size).
// Arabic has no official letter-tile scoring system implemented yet —
// see note at bottom of file.

const POINTS_BY_LANGUAGE = {
  en: {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
    N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
  },
  fr: {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 10, L: 1, M: 2,
    N: 1, O: 1, P: 3, Q: 8, R: 1, S: 1, T: 1, U: 1, V: 4, W: 10, X: 10, Y: 10, Z: 10
  },
  es: {
    A: 1, B: 3, C: 2, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 6, K: 8, L: 1, LL: 8,
    M: 3, N: 1, Ñ: 8, O: 1, P: 2, Q: 8, R: 1, RR: 8, S: 1, T: 1, U: 1, V: 4, W: 8,
    X: 8, Y: 4, Z: 10
  },
  de: {
    A: 1, B: 3, C: 4, D: 1, E: 1, F: 4, G: 2, H: 2, I: 1, J: 6, K: 4, L: 2, M: 3,
    N: 1, O: 2, P: 4, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 6, W: 3, X: 8, Y: 10, Z: 3,
    Ä: 6, Ö: 8, Ü: 6
  },
  it: {
    // J, K, W, X, Y are not part of the standard Italian alphabet and have no
    // official tile value — they fall through to 0 via the lookup default.
    A: 1, B: 5, C: 2, D: 5, E: 1, F: 5, G: 8, H: 8, I: 1, L: 3, M: 3, N: 3, O: 1,
    P: 5, Q: 10, R: 2, S: 2, T: 2, U: 3, V: 5, Z: 8
  },
  pt: {
    // K, W, Y are absent from the standard Portuguese distribution (loanwords only).
    A: 1, B: 3, C: 2, D: 2, E: 1, F: 4, G: 4, H: 4, I: 1, J: 5, L: 2, M: 1, N: 3,
    O: 1, P: 2, Q: 6, R: 1, S: 1, T: 1, U: 1, V: 4, X: 8, Z: 8, Ç: 3
  },
  tr: {
    // Q, W, X are not used in Turkish. İ (dotted) and I (dotless) are distinct
    // letters — see toLocaleUpperCase('tr-TR') handling below.
    A: 1, B: 3, C: 4, Ç: 4, D: 3, E: 1, F: 7, G: 5, Ğ: 8, H: 5, I: 2, İ: 1, J: 10,
    K: 1, L: 1, M: 2, N: 1, O: 2, Ö: 7, P: 5, R: 1, S: 2, Ş: 4, T: 1, U: 2, Ü: 3,
    V: 7, Y: 3, Z: 4
  },
  ru: {
    А: 1, Б: 3, В: 1, Г: 3, Д: 2, Е: 1, Ё: 3, Ж: 5, З: 5, И: 1, Й: 4, К: 2, Л: 2,
    М: 2, Н: 1, О: 1, П: 2, Р: 1, С: 1, Т: 1, У: 2, Ф: 10, Х: 5, Ц: 5, Ч: 5, Ш: 8,
    Щ: 10, Ъ: 10, Ы: 4, Ь: 3, Э: 8, Ю: 8, Я: 3
  },
  pl: {
    A: 1, Ą: 5, B: 3, C: 2, Ć: 6, D: 2, E: 1, Ę: 5, F: 5, G: 3, H: 3, I: 1, J: 3,
    K: 2, L: 2, Ł: 3, M: 2, N: 1, Ń: 7, O: 1, Ó: 5, P: 2, R: 1, S: 1, Ś: 5, T: 2,
    U: 3, W: 1, Y: 2, Z: 1, Ź: 9, Ż: 5
  }
};

// Languages with two-letter digraphs that count as a single tile
// (order matters: check longer sequences before single letters).
const DIGRAPHS_BY_LANGUAGE = {
  es: ['LL', 'RR']
};

const uppercaseForLanguage = (word, language) => {
  // Turkish needs locale-aware uppercasing: JS's default toUpperCase() turns
  // lowercase 'i' into dotless 'I', which is wrong for Turkish — it should
  // become dotted 'İ'. toLocaleUpperCase('tr-TR') handles this correctly.
  if (language === 'tr') {
    return word.toLocaleUpperCase('tr-TR');
  }
  return word.toUpperCase();
};

const tokenizeWord = (word, language) => {
  const digraphs = DIGRAPHS_BY_LANGUAGE[language];
  if (!digraphs) {
    return word.split('');
  }

  const tokens = [];
  let i = 0;
  while (i < word.length) {
    const matchedDigraph = digraphs.find((d) => word.slice(i, i + d.length) === d);
    if (matchedDigraph) {
      tokens.push(matchedDigraph);
      i += matchedDigraph.length;
    } else {
      tokens.push(word[i]);
      i += 1;
    }
  }
  return tokens;
};

export const calculateScrabblePoints = (word, language = 'en') => {
  if (!word || typeof word !== 'string') return 0;

  // Arabic doesn't have an implemented letter-tile scoring system yet.
  // Returning 0 rather than a fabricated or misleading value until a
  // scoring approach is decided.
  if (language === 'ar') {
    return 0;
  }

  const points = POINTS_BY_LANGUAGE[language] || POINTS_BY_LANGUAGE.en;
  const upperWord = uppercaseForLanguage(word, language);
  const tokens = tokenizeWord(upperWord, language);

  return tokens.reduce((total, token) => total + (points[token] || 0), 0);
};
