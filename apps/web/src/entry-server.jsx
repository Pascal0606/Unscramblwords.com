import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Blog, { BlogArticle } from '@/pages/Blog.jsx';
import { LanguageProvider } from '@/context/LanguageContext.jsx';

// Minimal, SSR-safe route tree covering only the blog pages -- the ones that
// actually need to be visible to search/ad crawlers. The main interactive
// tool page is intentionally left out of this pass; it uses browser-only
// state that isn't meaningful to pre-render the same way.
const BlogPage = ({ lang }) => (
  <LanguageProvider lang={lang}>
    <Blog />
  </LanguageProvider>
);

const BlogArticlePage = ({ lang }) => (
  <LanguageProvider lang={lang}>
    <BlogArticle />
  </LanguageProvider>
);

const LANGS = ['en', 'fr', 'de', 'it', 'es', 'pt', 'tr', 'ru', 'pl', 'ar'];

export function render(url) {
  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <Routes>
        {LANGS.map(lang => (
          <React.Fragment key={lang}>
            <Route path={`/${lang}/blog`} element={<BlogPage lang={lang} />} />
            <Route path={`/${lang}/blog/:slug`} element={<BlogArticlePage lang={lang} />} />
          </React.Fragment>
        ))}
      </Routes>
    </StaticRouter>
  );
  const helmet = Helmet.renderStatic();
  return { appHtml, helmet };
}
