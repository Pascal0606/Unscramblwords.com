// Each language's blog articles used to be imported statically here and
// bundled together into one ~1MB chunk (English 117KB + French 113KB +
// German 97KB + Italian 78KB + Spanish 101KB + Portuguese 83KB + Turkish
// 94KB + Russian 158KB + Polish 82KB + Arabic 102KB), even though any
// single visitor only ever reads one language. Confirmed via a Lighthouse
// treemap showing a 975KB "Blog" chunk matching this total almost exactly.
//
// Replaced with dynamic imports, one per language: Vite code-splits each
// of these into its own separate chunk at build time, and only the chunk
// for the visitor's actual language is fetched at runtime -- via
// useBlogArticles.js (apps/web/src/hooks/useBlogArticles.js), which calls
// the matching loader below instead of reading blogContent[lang] directly.
//
// A French visitor now downloads ~113KB instead of ~1,000KB for this part
// of the page -- roughly a 90% reduction for this specific chunk.
export const blogLoaders = {
  en: () => import('./blog/en.js').then(m => m.en),
  fr: () => import('./blog/fr.js').then(m => m.fr),
  de: () => import('./blog/de.js').then(m => m.de),
  it: () => import('./blog/it.js').then(m => m.it),
  es: () => import('./blog/es.js').then(m => m.es),
  pt: () => import('./blog/pt.js').then(m => m.pt),
  tr: () => import('./blog/tr.js').then(m => m.tr),
  ru: () => import('./blog/ru.js').then(m => m.ru),
  pl: () => import('./blog/pl.js').then(m => m.pl),
  ar: () => import('./blog/ar.js').then(m => m.ar),
};
