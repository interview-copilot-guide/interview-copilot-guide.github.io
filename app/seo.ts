import { products, researchDateIso } from "@/data/products";
import {
  defaultLocale,
  getLocaleConfig,
  getMessages,
  locales,
  localeUrl,
  type LocaleCode,
} from "@/i18n";

export const siteName = "Interview Copilot Guide";

/** The guide is published by a vendor that also appears in the comparison. */
export const publisherName = "Autocue";
export const publisherUrl = "https://autocue.chat";

/** Escapes the five XML/HTML metacharacters for use in attribute values and text. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Safe to embed inside a <script> block: neutralises a literal `</script>`. */
export function escapeJson(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export type HeadOptions = {
  locale: LocaleCode;
  siteUrl: string;
  /** Path prefix the site is served from, e.g. "/" or "/repo-name/". */
  basePath: string;
};

function assetUrl(siteUrl: string, file: string) {
  return `${siteUrl.replace(/\/$/, "")}/${file}`;
}

/** JSON-LD graph: the site, the publisher, the comparison list and the FAQ. */
export function buildStructuredData({ locale, siteUrl }: HeadOptions) {
  const config = getLocaleConfig(locale);
  const messages = getMessages(locale);
  const pageUrl = localeUrl(siteUrl, locale);
  const imageUrl = assetUrl(siteUrl, "og.png");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: imageUrl,
        // The guide is vendor-published; say so in the structured data too.
        parentOrganization: { "@id": `${siteUrl}/#publisher` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#publisher`,
        name: publisherName,
        url: publisherUrl,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#publisher` },
        inLanguage: locales.map((item) => item.hreflang),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: messages.seo.title,
        description: messages.seo.description,
        inLanguage: config.hreflang,
        isPartOf: { "@id": `${siteUrl}/#website` },
        publisher: { "@id": `${siteUrl}/#publisher` },
        dateModified: researchDateIso,
        primaryImageOfPage: imageUrl,
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#products`,
        name: messages.seo.shortTitle,
        numberOfItems: products.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            name: product.name,
            url: product.url,
            applicationCategory: "BusinessApplication",
            description: product.unique,
            ...(product.monthlyUsd === null
              ? {}
              : {
                  offers: {
                    "@type": "Offer",
                    price: product.monthlyUsd,
                    priceCurrency: "USD",
                    category: "subscription",
                  },
                }),
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: config.hreflang,
        mainEntity: messages.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** Every <head> tag that varies by locale, as a raw HTML string. */
export function buildHeadTags({ locale, siteUrl, basePath }: HeadOptions): string {
  const config = getLocaleConfig(locale);
  const messages = getMessages(locale);
  const pageUrl = localeUrl(siteUrl, locale);
  const imageUrl = assetUrl(siteUrl, "og.png");
  const structuredData = buildStructuredData({ locale, siteUrl, basePath });

  const alternates = [
    ...locales.map(
      (item) =>
        `<link rel="alternate" hreflang="${item.hreflang}" href="${escapeHtml(localeUrl(siteUrl, item.code))}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(localeUrl(siteUrl, defaultLocale))}" />`,
  ];

  return [
    `<title>${escapeHtml(messages.seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(messages.seo.description)}" />`,
    `<meta name="keywords" content="${escapeHtml(messages.seo.keywords)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`,
    ...alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:locale" content="${config.ogLocale}" />`,
    ...locales
      .filter((item) => item.code !== locale)
      .map((item) => `<meta property="og:locale:alternate" content="${item.ogLocale}" />`),
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta property="og:title" content="${escapeHtml(messages.seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(messages.seo.ogDescription)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(messages.seo.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(messages.seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(messages.seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(messages.seo.imageAlt)}" />`,
    `<meta name="theme-color" content="#172520" />`,
    `<link rel="icon" href="${escapeHtml(basePath)}favicon.svg" type="image/svg+xml" />`,
    `<link rel="apple-touch-icon" href="${escapeHtml(basePath)}apple-touch-icon.png" />`,
    `<link rel="manifest" href="${escapeHtml(basePath)}site.webmanifest" />`,
    `<script type="application/ld+json">${escapeJson(structuredData)}</script>`,
  ].join("\n    ");
}

/** sitemap.xml with reciprocal hreflang alternates on every URL entry. */
export function buildSitemap(siteUrl: string): string {
  const entries = locales
    .map((item) => {
      const alternates = locales
        .map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeHtml(localeUrl(siteUrl, alternate.code))}" />`,
        )
        .join("\n");
      return [
        "  <url>",
        `    <loc>${escapeHtml(localeUrl(siteUrl, item.code))}</loc>`,
        `    <lastmod>${researchDateIso}</lastmod>`,
        "    <changefreq>weekly</changefreq>",
        `    <priority>${item.code === defaultLocale ? "1.0" : "0.8"}</priority>`,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(localeUrl(siteUrl, defaultLocale))}" />`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}

export function buildRobotsTxt(siteUrl: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    "",
  ].join("\n");
}

export function buildWebManifest(): string {
  const messages = getMessages(defaultLocale);
  return `${JSON.stringify(
    {
      name: messages.seo.title,
      short_name: siteName,
      description: messages.seo.description,
      start_url: "./",
      display: "browser",
      background_color: "#f2f1e4",
      theme_color: "#172520",
      icons: [
        { src: "favicon.svg", sizes: "any", type: "image/svg+xml" },
        { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    null,
    2,
  )}\n`;
}
