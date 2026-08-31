// Generates a correct, complete sitemap.xml from the site's actual routes and
// blog content, run as part of every build. This replaces a static file that
// had gone stale -- it listed a literal ":slug" placeholder instead of real
// article URLs, still referenced the removed Chinese language, and was
// missing Polish entirely.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, '../public/sitemap.xml');

const LANGS = ['en', 'fr', 'de', 'it', 'es', 'pt', 'tr', 'ru', 'pl', 'ar'];
const BASE = 'https://unscramblwords.com';

async function main() {
  const blogContentPath = path.resolve(__dirname, '../src/i18n/blogContent.js');
  const { blogContent } = await import(blogContentPath);

  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  const addUrl = (loc, priority = '0.8') => {
    urls.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`);
  };

  // Root + each language's main tool page.
  addUrl(BASE, '1.0');
  for (const lang of LANGS) {
    addUrl(`${BASE}/${lang}`, '1.0');
  }

  addUrl(`${BASE}/privacy`, '0.3');

  // Each language's blog listing, plus every real article it actually has.
  for (const lang of LANGS) {
    addUrl(`${BASE}/${lang}/blog`, '0.9');
    const articles = blogContent[lang] || [];
    for (const article of articles) {
      addUrl(`${BASE}/${lang}/blog/${article.slug}`, '0.7');
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  fs.writeFileSync(OUT_PATH, xml, 'utf-8');
  console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
}

main();
