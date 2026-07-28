import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UnscrambleApp from '@/pages/UnscrambleApp.jsx';
import PrivacyPolicy from '@/pages/PrivacyPolicy.jsx';
import Blog, { BlogArticle } from '@/pages/Blog.jsx';
import CookieConsentBanner from '@/components/CookieConsentBanner.jsx';
import { LanguageProvider } from '@/context/LanguageContext.jsx';

const LangPage = ({ lang }) => (
  <LanguageProvider lang={lang}>
    <UnscrambleApp />
    <CookieConsentBanner />
  </LanguageProvider>
);

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />

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
        <Route path="/zh/blog" element={<BlogPage lang="zh" />} />
        <Route path="/zh/blog/:slug" element={<BlogArticlePage lang="zh" />} />
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
        <Route path="/zh" element={<LangPage lang="zh" />} />
        <Route path="/ar" element={<LangPage lang="ar" />} />
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;