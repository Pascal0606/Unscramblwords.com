import { useState, useEffect } from 'react';
import { blogLoaders } from '@/i18n/blogContent.js';

// Loads one language's blog articles on demand, so a visitor downloads only
// their own language's chunk instead of all ten languages bundled together.
// Mirrors the previous `blogContent[currentLanguage] || blogContent['en']`
// fallback behaviour: if the requested language has no loader, or its chunk
// fails to load for any reason (e.g. a network blip), falls back to English
// rather than leaving the page stuck or broken. If English itself fails,
// returns an empty array so the page can still render its "not found" /
// "no articles" states instead of crashing.
export function useBlogArticles(currentLanguage) {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const loadEnglishFallback = () => {
      blogLoaders.en()
        .then((data) => {
          if (!cancelled) {
            setArticles(data || []);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setArticles([]);
            setLoading(false);
          }
        });
    };

    const loader = blogLoaders[currentLanguage] || blogLoaders.en;

    loader()
      .then((data) => {
        if (!cancelled) {
          setArticles(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (currentLanguage !== 'en') {
          loadEnglishFallback();
        } else if (!cancelled) {
          setArticles([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [currentLanguage]);

  return { articles: articles || [], loading };
}
