import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CookieConsentBanner from '@/components/CookieConsentBanner.jsx';
import { LanguageProvider } from '@/context/LanguageContext.jsx';

// Code-split each page's component so a visitor only downloads the JS the
// page they're actually on needs -- previously all three were bundled
// together, meaning a homepage visitor (the common case, since ads link
// directly to the tool) was forced to also download the entire blog
// system's code (schema markup, related-articles logic, FAQ rendering,
// etc.) before the page could finish loading. Confirmed via PageSpeed
// Insights: this was a real, measured contributor to a failing Core Web
// Vitals score (5.6s LCP against Google's 2.5s "good" threshold), not
// just a theoretical concern.
const UnscrambleApp = lazy(() => import('@/pages/UnscrambleApp.jsx'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy.jsx'));
const Blog = lazy(() => import('@/pages/Blog.jsx').then(m => ({ default: m.default })));
const BlogArticle = lazy(() => import('@/pages/Blog.jsx').then(m => ({ default: m.BlogArticle })));

const LangPage = ({ lang }) => (
  <LanguageProvider lang={lang}>
    <Suspense fallback={null}>
      <UnscrambleApp />
    </Suspense>
    <CookieConsentBanner />
  </LanguageProvider>
);

const BlogPage = ({ lang }) => (
  <LanguageProvider lang={lang}>
    <Suspense fallback={null}>
      <Blog />
    </Suspense>
  </LanguageProvider>
);

const BlogArticlePage = ({ lang }) => (
  <LanguageProvider lang={lang}>
    <Suspense fallback={null}>
      <BlogArticle />
    </Suspense>
  </LanguageProvider>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/privacy" element={<Suspense fallback={null}><PrivacyPolicy /></Suspense>} />

        <Route path="/blog" element={<BlogPage lang="en" />} />
        <Route path="/blog/:slug" element={<BlogArticlePage lang="en" />} />

        <Route path="/en/blog" element={<BlogPage lang="en" />} />
        <Route path="/en/blog/:slug" element={<BlogArticlePage lang="en" />} />
        <Route path="/fr/blog" element={<BlogPage lang="fr" />} />
        <Route path="/fr/blog/:slug" element={<BlogArticlePage lang="fr" />} />
        <Route path="/de/blog" element={<BlogPage lang="de" />} />
        <Route path="/de/blog/:slug" element={<BlogArticlePage lang="de" />} />
        <Route path="/it/blog" element={<BlogPage lang="it" />} />
        <Route path="/it/blog/:slug" element={<BlogArticlePage lang="it" />} />
        <Route path="/es/blog" element={<BlogPage lang="es" />} />
        <Route path="/es/blog/:slug" element={<BlogArticlePage lang="es" />} />
        <Route path="/pt/blog" element={<BlogPage lang="pt" />} />
        <Route path="/pt/blog/:slug" element={<BlogArticlePage lang="pt" />} />
        <Route path="/tr/blog" element={<BlogPage lang="tr" />} />
        <Route path="/tr/blog/:slug" element={<BlogArticlePage lang="tr" />} />
        <Route path="/ru/blog" element={<BlogPage lang="ru" />} />
        <Route path="/ru/blog/:slug" element={<BlogArticlePage lang="ru" />} />
        <Route path="/pl/blog" element={<BlogPage lang="pl" />} />
        <Route path="/pl/blog/:slug" element={<BlogArticlePage lang="pl" />} />
        <Route path="/ar/blog" element={<BlogPage lang="ar" />} />
        <Route path="/ar/blog/:slug" element={<BlogArticlePage lang="ar" />} />

        <Route path="/en" element={<LangPage lang="en" />} />
        <Route path="/fr" element={<LangPage lang="fr" />} />
        <Route path="/de" element={<LangPage lang="de" />} />
        <Route path="/it" element={<LangPage lang="it" />} />
        <Route path="/es" element={<LangPage lang="es" />} />
        <Route path="/pt" element={<LangPage lang="pt" />} />
        <Route path="/tr" element={<LangPage lang="tr" />} />
        <Route path="/ru" element={<LangPage lang="ru" />} />
        <Route path="/pl" element={<LangPage lang="pl" />} />
        <Route path="/ar" element={<LangPage lang="ar" />} />
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
