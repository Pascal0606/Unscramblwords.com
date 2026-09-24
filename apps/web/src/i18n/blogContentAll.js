// Build-time-only version of the old blogContent.js: statically imports all
// ten languages into one object. Used exclusively by the Node build scripts
// (generate-sitemap.mjs, generate-llms.js, prerender.mjs) which genuinely
// need every language's articles at once -- to list every language's URLs
// in the sitemap, describe every language's articles in llms.txt, and
// prerender a static HTML page per language per article.
//
// This file is never imported by any browser-facing code (Blog.jsx and
// useBlogArticles.js use blogContent.js's dynamic blogLoaders instead), so
// bundling all ten languages here has no effect on what a visitor downloads
// -- it only runs in Node during the build.
import { en } from './blog/en.js';
import { fr } from './blog/fr.js';
import { de } from './blog/de.js';
import { it } from './blog/it.js';
import { es } from './blog/es.js';
import { pt } from './blog/pt.js';
import { tr } from './blog/tr.js';
import { ru } from './blog/ru.js';
import { pl } from './blog/pl.js';
import { ar } from './blog/ar.js';

export const blogContent = { en, fr, de, it, es, pt, tr, ru, pl, ar };
