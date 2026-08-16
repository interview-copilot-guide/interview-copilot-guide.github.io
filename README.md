# Signalboard 26 — The Interview Copilot Guide

A practical, source-linked guide to real-time AI interview copilots and adjacent services. Readers can learn how these tools work, compare pricing and setup, identify suitable options for different interview situations, and build a shortlist that fits their needs.

Published by [Autocue](https://autocue.chat), which also appears in the comparison. Every record is compiled the same way and quick-fit examples are alphabetical, with Autocue last in its row.

Guide reviewed: **10–16 August 2026**. 69 products compared.

## Languages

The guide is published in 11 languages, each pre-rendered as its own indexable page with localised titles, descriptions and structured data:

| Path | Language | | Path | Language |
| --- | --- | --- | --- | --- |
| `/` | English | | `/fr/` | Français |
| `/es/` | Español | | `/de/` | Deutsch |
| `/zh/` | 简体中文 | | `/ja/` | 日本語 |
| `/hi/` | हिन्दी | | `/ko/` | 한국어 |
| `/ar/` | العربية (RTL) | | `/ru/` | Русский |
| `/pt/` | Português (BR) | | | |

Editorial copy, navigation, filters and FAQ answers are translated. The 69 product records stay in English on purpose: they quote each vendor's own published wording, so translating them would make the source claims harder to verify. Those cells are marked `lang="en"` and, in the right-to-left layout, kept left-to-right.

To add a language: append an entry to `i18n/locales.ts`, add `i18n/messages/<code>.ts` (TypeScript checks it against the English dictionary shape), and register it in `i18n/index.ts`. The build, sitemap and hreflang tags pick it up automatically.

## Search visibility

`npm run export:github` produces a static site that is fully rendered at build time — crawlers receive the complete comparison table rather than an empty root element. Each page ships:

- a localised `<title>`, meta description and keywords;
- `<link rel="canonical">` plus reciprocal `hreflang` alternates for all 11 locales and `x-default`;
- Open Graph and Twitter card tags, including `og:locale:alternate`;
- JSON-LD (`Organization`, `WebSite`, `WebPage`, an `ItemList` of all 69 products, and a `FAQPage`);
- `sitemap.xml` with per-URL hreflang alternates, `robots.txt` and a web manifest.

## Publish as a GitHub organization Page

1. Create or use the organization's special Pages repository named `ORGANIZATION.github.io`.
2. Copy this project into that repository and push it to the `main` branch.
3. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The included workflow type-checks, lints, builds and publishes the static site automatically.

For a project Page instead of an organization root Page, set `GITHUB_PAGES_BASE` to `/<repository-name>/` and `VITE_SITE_URL` to the full project-page URL in `.github/workflows/deploy-pages.yml`.

## Local preview

```bash
npm install
npm run dev
```

## Production checks

```bash
npm run typecheck
npm run lint
npm run test          # builds both surfaces, then asserts the rendered output
npm run export:github # static output only
```

The deployable static output is written to `github-pages-dist/` (git-ignored — CI rebuilds it).

## Updating the guide

All comparison records live in `data/products.ts`. Unknown or unavailable fields are intentionally marked rather than inferred. Vendor "invisible," "undetectable," and screen-share claims have not been independently penetration-tested.
