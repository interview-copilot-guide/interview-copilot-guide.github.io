import { renderToString } from "react-dom/server";
import { MarketResearch } from "../app/MarketResearch";
import { buildHeadTags, escapeJson } from "../app/seo";
import { getLocaleConfig, getMessages, type LocaleCode } from "../i18n";
import { bootstrapGlobal, type Bootstrap } from "./bootstrap";

// Re-exported so build/build-pages.mjs only ever loads one bundle, which keeps
// the locale list and the rendered pages from drifting apart.
export { buildRobotsTxt, buildSitemap, buildWebManifest } from "../app/seo";
export { defaultLocale, locales, localePath } from "../i18n";

export type RenderOptions = {
  locale: LocaleCode;
  siteUrl: string;
  basePath: string;
  /** Site-root-absolute URLs of the built client assets. */
  scripts: string[];
  stylesheets: string[];
};

/** Renders one fully-formed, indexable HTML document for a single locale. */
export function renderPage({ locale, siteUrl, basePath, scripts, stylesheets }: RenderOptions): string {
  const config = getLocaleConfig(locale);
  const messages = getMessages(locale);

  const bootstrap: Bootstrap = { locale, basePath, messages };
  const appHtml = renderToString(
    <MarketResearch locale={locale} messages={messages} basePath={basePath} />,
  );

  const head = [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    buildHeadTags({ locale, siteUrl, basePath }),
    ...stylesheets.map((href) => `<link rel="stylesheet" crossorigin href="${href}">`),
    ...scripts.map((src) => `<script type="module" crossorigin src="${src}"></script>`),
  ].join("\n    ");

  return `<!doctype html>
<html lang="${config.htmlLang}" dir="${config.dir}">
  <head>
    ${head}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script>window.${bootstrapGlobal}=${escapeJson(bootstrap)}</script>
  </body>
</html>
`;
}
