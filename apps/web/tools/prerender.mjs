// Post-build prerendering step.
//
// This app is a plain client-side-rendered React SPA (no SSR framework),
// which means crawlers that don't fully execute JavaScript -- including,
// apparently, whatever evaluates content for AdSense -- see an essentially
// empty page for every route. Since every blog route is fully known at
// build time (10 languages x however many articles each has), we can
// pre-render just the blog pages to real static HTML using React's own
// server-rendering API, without needing a full SSR framework or a headless
// browser.
//
// For each blog route, this writes a real index.html file at the matching
// path (e.g. dist/en/blog/index.html, dist/en/blog/some-slug/index.html)
// containing the fully-rendered article content plus the correct
// react-helmet title/meta tags for that specific page. The client-side JS
// bundle still loads and hydrates on top for interactivity -- this only
// fixes what crawlers see on first load, it doesn't change the runtime
// behavior for real visitors at all.
//
// The main interactive tool page (the word unscrambler itself) is
// deliberately NOT included in this pass -- it's an interactive app, not
// content in the same sense, and isn't part of the "low value content"
// problem this addresses.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.resolve(__dirname, '../../../dist/apps/web');
const SSR_ENTRY = path.resolve(__dirname, '../../../dist-ssr/entry-server.js');

const LANGS = ['en', 'fr', 'de', 'it', 'es', 'pt', 'tr', 'ru', 'pl', 'ar'];

async function main() {
  const { render } = await import(SSR_ENTRY);

  const blogContentPath = path.resolve(__dirname, '../src/i18n/blogContent.js');
  const { blogContent } = await import(blogContentPath);

  const template = fs.readFileSync(path.join(CLIENT_DIST, 'index.html'), 'utf-8');

  let count = 0;
  const errors = [];

  for (const lang of LANGS) {
    const articles = blogContent[lang] || [];

    // The blog listing page for this language.
    writeRoute(`/${lang}/blog`, template, render, () => count++, errors);

    // Every individual article page for this language.
    for (const article of articles) {
      writeRoute(`/${lang}/blog/${article.slug}`, template, render, () => count++, errors);
    }
  }

  console.log(`Prerendered ${count} blog pages.`);
  if (errors.length) {
    console.error(`${errors.length} pages failed to prerender:`);
    errors.forEach(e => console.error('  -', e.url, ':', e.message));
    process.exitCode = 1;
  }
}

function writeRoute(url, template, render, onSuccess, errors) {
  try {
    const { appHtml, helmet } = render(url);

    let html = template;

    // Inject the fully-rendered app content into the root div.
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Replace the generic <title> with this page's real title, if Helmet
    // captured one for this route.
    const helmetTitle = helmet.title.toString();
    if (helmetTitle && helmetTitle.includes('<title')) {
      html = html.replace(/<title>.*?<\/title>/s, helmetTitle);
    }

    // Remove the template's generic meta description before injecting this
    // page's real one -- crawlers generally only respect the first
    // description tag found, so leaving both in place would mean the
    // specific, correct one loses to the generic fallback.
    const helmetMeta = helmet.meta.toString();
    const helmetLink = helmet.link.toString();
    if (helmetMeta) {
      html = html.replace(/<meta name="description"[^>]*\/?>/, '');
    }
    if (helmetMeta || helmetLink) {
      html = html.replace('</head>', `${helmetMeta}\n${helmetLink}\n</head>`);
    }

    const outDir = path.dirname(path.join(CLIENT_DIST, url + '.html'));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(CLIENT_DIST, url + '.html'), html, 'utf-8');
    onSuccess();
  } catch (err) {
    errors.push({ url, message: err.message });
  }
}

main();
