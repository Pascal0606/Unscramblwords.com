#!/usr/bin/env node
//
// Generates public/llms.txt -- a plain-text index of the site's real pages,
// following the llms.txt convention some AI systems use to understand a
// site's content.
//
// Three page types have real, known content sources, and are read directly
// rather than guessed at via regex:
//   - The homepage tool page: one entry per language, using that language's
//     actual seoTitle/seoDescription from translations.js.
//   - Blog articles: one entry per (language, article), using the real
//     title/excerpt already stored in blogContent.js -- not a generic
//     placeholder, since we have the genuine content on hand.
//   - The privacy policy: a single static page, whose title/description are
//     static text even though the source writes them as a JS template
//     literal rather than plain JSX text.
//
// Any OTHER page file in src/pages/ (e.g. a new page added later that this
// script doesn't yet know about) falls back to the original regex-based
// scanner, so nothing silently goes undetected -- it just won't be as
// precise as the three cases above until this file is updated for it too.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://unscramblwords.com';

// --- Generic regex-based fallback scanner (for unlisted page files) -------

const CLEAN_CONTENT_REGEX = {
	// A previous version of this matched "//" inside URLs like "https://..."
	// as if it were a line comment, silently deleting the rest of that line
	// (including a closing backtick), which cascaded into completely
	// mangling every page's Helmet block. The negative lookbehind excludes
	// any "//" immediately preceded by ":", which real single-line comments
	// never are.
	comments: /\/\*[\s\S]*?\*\/|(?<!:)\/\/.*$/gm,
	templateLiterals: /`[\s\S]*?`/g,
	strings: /'[^']*'|"[^"]*"/g,
	jsxExpressions: /\{.*?\}/g,
	htmlEntities: {
		quot: /&quot;/g,
		amp: /&amp;/g,
		lt: /&lt;/g,
		gt: /&gt;/g,
		apos: /&apos;/g
	}
};

const EXTRACTION_REGEX = {
	route: /<Route\s+[^>]*>/g,
	path: /path=["']([^"']+)["']/,
	element: /element=\{<(\w+)[^}]*\/?\s*>\}/,
	helmet: /<Helmet[^>]*?>([\s\S]*?)<\/Helmet>/i,
	helmetTest: /<Helmet[\s\S]*?<\/Helmet>/i,
	title: /<title[^>]*?>\s*(.*?)\s*<\/title>/i,
	description: /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
};

function cleanContent(content) {
	return content
		.replace(CLEAN_CONTENT_REGEX.comments, '')
		.replace(CLEAN_CONTENT_REGEX.templateLiterals, '""')
		.replace(CLEAN_CONTENT_REGEX.strings, '""');
}

function cleanText(text) {
	if (!text) return text;

	return text
		.replace(CLEAN_CONTENT_REGEX.jsxExpressions, '')
		.replace(CLEAN_CONTENT_REGEX.htmlEntities.quot, '"')
		.replace(CLEAN_CONTENT_REGEX.htmlEntities.amp, '&')
		.replace(CLEAN_CONTENT_REGEX.htmlEntities.lt, '<')
		.replace(CLEAN_CONTENT_REGEX.htmlEntities.gt, '>')
		.replace(CLEAN_CONTENT_REGEX.htmlEntities.apos, "'")
		.trim();
}

function extractRoutes(appJsxPath) {
	if (!fs.existsSync(appJsxPath)) return new Map();

	try {
		const content = fs.readFileSync(appJsxPath, 'utf8');
		const routes = new Map();
		const routeMatches = [...content.matchAll(EXTRACTION_REGEX.route)];

		for (const match of routeMatches) {
			const routeTag = match[0];
			const pathMatch = routeTag.match(EXTRACTION_REGEX.path);
			const elementMatch = routeTag.match(EXTRACTION_REGEX.element);
			const isIndex = routeTag.includes('index');

			if (elementMatch) {
				const componentName = elementMatch[1];
				let routePath;

				if (isIndex) {
					routePath = '/';
				} else if (pathMatch) {
					routePath = pathMatch[1].startsWith('/') ? pathMatch[1] : `/${pathMatch[1]}`;
				}

				routes.set(componentName, routePath);
			}
		}

		return routes;
	} catch (error) {
		return new Map();
	}
}

function generateFallbackUrl(fileName) {
	const cleanName = fileName.replace(/Page$/, '').toLowerCase();
	return cleanName === 'app' ? '/' : `/${cleanName}`;
}

function extractHelmetData(content, filePath, routes) {
	const cleanedContent = cleanContent(content);

	if (!EXTRACTION_REGEX.helmetTest.test(cleanedContent)) {
		return null;
	}

	const helmetMatch = content.match(EXTRACTION_REGEX.helmet);
	if (!helmetMatch) return null;

	const helmetContent = helmetMatch[1];
	const titleMatch = helmetContent.match(EXTRACTION_REGEX.title);
	const descMatch = helmetContent.match(EXTRACTION_REGEX.description);

	const title = cleanText(titleMatch?.[1]);
	const description = cleanText(descMatch?.[1]);

	const fileName = path.basename(filePath, path.extname(filePath));
	const url = routes.size && routes.has(fileName)
		? routes.get(fileName)
		: generateFallbackUrl(fileName);

	if (!title && !description) return null;

	return {
		url,
		title: title || 'Untitled Page',
		description: description || 'No description available'
	};
}

function scanUnlistedPages(pagesDir, appJsxPath, knownFileNames) {
	if (!fs.existsSync(pagesDir)) return [];

	const routes = extractRoutes(appJsxPath);
	const files = fs.readdirSync(pagesDir)
		.map(item => path.join(pagesDir, item))
		.filter(filePath => fs.statSync(filePath).isFile())
		.filter(filePath => !knownFileNames.has(path.basename(filePath)));

	return files
		.map(filePath => {
			try {
				const content = fs.readFileSync(filePath, 'utf8');
				return extractHelmetData(content, filePath, routes);
			} catch (error) {
				console.error(`Error scanning ${filePath}:`, error.message);
				return null;
			}
		})
		.filter(Boolean);
}

// --- High-fidelity handling for the three known content sources -----------

async function getHomepagePages(srcDir) {
	const { translations } = await import(path.join(srcDir, 'i18n', 'translations.js'));
	const pages = [];

	for (const lang of Object.keys(translations)) {
		const ui = translations[lang]?.ui;
		if (ui?.seoTitle) {
			pages.push({
				url: `/${lang}`,
				title: ui.seoTitle,
				description: ui.seoDescription || 'No description available'
			});
		}
	}

	return pages;
}

async function getBlogPages(srcDir) {
	const { blogContent } = await import(path.join(srcDir, 'i18n', 'blogContent.js'));
	const pages = [];

	for (const lang of Object.keys(blogContent)) {
		const articles = blogContent[lang] || [];
		for (const article of articles) {
			if (!article.slug || !article.title) continue;
			pages.push({
				url: `/${lang}/blog/${article.slug}`,
				title: article.title,
				description: article.excerpt || 'No description available'
			});
		}
	}

	return pages;
}

function getPrivacyPage() {
	return [{
		url: '/privacy',
		title: 'Privacy Policy - UnscramblWords',
		description: 'Privacy Policy and terms of data usage for UnscramblWords'
	}];
}

function generateLlmsTxt(pages) {
	const sortedPages = [...pages].sort((a, b) => a.title.localeCompare(b.title));
	const pageEntries = sortedPages.map(page =>
		`- [${page.title}](${BASE_URL}${page.url}): ${page.description}`
	).join('\n');

	return `## Pages\n${pageEntries}\n`;
}

function ensureDirectoryExists(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

async function main() {
	const srcDir = path.join(process.cwd(), 'src');
	const pagesDir = path.join(srcDir, 'pages');
	const appJsxPath = path.join(srcDir, 'App.jsx');

	const homepagePages = await getHomepagePages(srcDir);
	const blogPages = await getBlogPages(srcDir);
	const privacyPage = getPrivacyPage();

	const knownFileNames = new Set([
		'UnscrambleApp.jsx',
		'PrivacyPolicy.jsx',
		'Blog.jsx',
		'BlogArticle.jsx',
		'HomePage.jsx'
	]);
	const unlistedPages = scanUnlistedPages(pagesDir, appJsxPath, knownFileNames);

	const pages = [...homepagePages, ...privacyPage, ...blogPages, ...unlistedPages];

	if (pages.length === 0) {
		console.error('No pages found to include in llms.txt!');
		process.exit(1);
	}

	const llmsTxtContent = generateLlmsTxt(pages);
	const outputPath = path.join(process.cwd(), 'public', 'llms.txt');

	ensureDirectoryExists(path.dirname(outputPath));
	fs.writeFileSync(outputPath, llmsTxtContent, 'utf8');

	console.log(`Generated llms.txt with ${pages.length} pages (${homepagePages.length} homepage, ${privacyPage.length} privacy, ${blogPages.length} blog, ${unlistedPages.length} other).`);
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
	main().catch(error => {
		console.error('Error generating llms.txt:', error.message);
		process.exit(1);
	});
}
