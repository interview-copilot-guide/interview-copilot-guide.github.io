import type { Metadata } from "next";
import { headers } from "next/headers";
import { defaultLocale, getLocaleConfig, getMessages, locales, localeUrl } from "@/i18n";
import { buildStructuredData, escapeJson, siteName } from "./seo";
import "./globals.css";

/** Reconstructs the deployed origin from the incoming request. */
async function resolveSiteUrl() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await resolveSiteUrl();
  const messages = getMessages(defaultLocale);
  const imageUrl = `${siteUrl}/og.png`;

  return {
    metadataBase: new URL(siteUrl),
    title: messages.seo.title,
    description: messages.seo.description,
    keywords: messages.seo.keywords.split(", "),
    applicationName: siteName,
    alternates: {
      canonical: siteUrl + "/",
      languages: Object.fromEntries(
        locales.map((locale) => [locale.hreflang, localeUrl(siteUrl, locale.code)]),
      ),
    },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      siteName,
      title: messages.seo.ogTitle,
      description: messages.seo.ogDescription,
      url: siteUrl + "/",
      locale: getLocaleConfig(defaultLocale).ogLocale,
      alternateLocale: locales.filter((l) => l.code !== defaultLocale).map((l) => l.ogLocale),
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: messages.seo.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.seo.ogTitle,
      description: messages.seo.ogDescription,
      images: [imageUrl],
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    themeColor: "#172520",
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteUrl = await resolveSiteUrl();
  const config = getLocaleConfig(defaultLocale);
  const structuredData = buildStructuredData({ locale: defaultLocale, siteUrl, basePath: "/" });

  return (
    <html lang={config.htmlLang} dir={config.dir}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJson(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
