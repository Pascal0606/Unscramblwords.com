# Blog publish-date fix — 6 September 2026

## What this replaces

`apps/web/src/pages/Blog.jsx` previously generated a fake publish date for every
article from its position in the array:

```js
const date = new Date(2025, 9 - index, 15 + (index * 2));
```

This produced dates that drifted backwards into 2024 for articles added later,
and had no relationship to when any article was actually written.

## Where the real dates came from

For every one of the 183 articles currently live across the ten language files,
I cloned the public GitHub repository and walked its **full commit history**
(including its earlier life as one monolithic `blogContent.js` file, before the
16 August restructuring into per-language files) to find the actual commit in
which each article first appeared.

Two honest exceptions, both explicitly agreed with Pascal beforehand:

- **The original ten articles per language** (plus one extra English article,
  `unscramble-9-letter-words`) were already present in the very first commit
  ("Initial import from Horizons export," 28 July 2026), because they were
  written on Hostinger's Horizons builder before the project moved to GitHub.
  Git history cannot tell these ten apart from one another, and no chat
  transcript documents the moment any one of them was individually written.
  Rather than invent an order, all of them carry the same date — **24 July
  2026** — the earliest point they are confirmed to have existed (the day the
  relevant chat session, "1. Unscramblwords.com modification request,"
  already referred to all 100 original articles as an established fact).
- **Every other article** (172 of the 183) carries its genuine, individually
  distinct commit date, verified directly against the repository — nothing
  estimated or interpolated.

## Files in this package

- `Blog.jsx` → replaces `apps/web/src/pages/Blog.jsx`. The fake date formula
  is gone; it now reads the real `date` field from each article and formats
  it per-locale. I also sorted the article list newest-first by that real
  date, since the old fake-date scheme was implicitly controlling which
  article appeared as "featured" (`index === 0`) — with genuine dates that
  aren't in array order, sorting is needed to keep the newest article
  featured, as intended.
- `en.js`, `fr.js`, `de.js`, `it.js`, `es.js`, `pt.js`, `tr.js`, `ru.js`,
  `pl.js`, `ar.js` → each replaces the matching file under
  `apps/web/src/i18n/blog/`. Every article object now carries a `date: 'YYYY-MM-DD'`
  field immediately after its `slug`. No other content was touched.

## Verified before delivery

- Every one of the 183 live (language, slug) pairs resolved to a real date —
  no gaps, nothing left blank.
- All eleven files (`Blog.jsx` plus the ten data files) pass a syntax check
  (via esbuild, JSX-aware) with no errors.

## Not yet done (optional, separate task)

The sitemap generator (`apps/web/tools/generate-sitemap.mjs`) still stamps
every URL's `lastmod` with the current build date regardless of whether that
page actually changed. This is the same underlying problem in a different
place, and could be fixed the same way (using each article's real `date`
field) — but it's a distinct piece of work from what was asked for today, so
I've left it for a future session unless you'd like it done now.

