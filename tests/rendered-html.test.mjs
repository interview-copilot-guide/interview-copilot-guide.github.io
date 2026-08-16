import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const distUrl = new URL("../github-pages-dist/", import.meta.url);

const readDist = (file) => readFile(new URL(file, distUrl), "utf8");

/** Locales the site ships, mirroring i18n/locales.ts. */
const localeDirs = ["es", "zh", "hi", "ar", "pt", "fr", "de", "ja", "ko", "ru"];

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://signalboard.example/", {
      headers: { accept: "text/html", host: "signalboard.example", "x-forwarded-proto": "https" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished interview copilot guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Interview Copilot Guide 2026/i);
  assert.match(html, /The interview/);
  assert.match(html, /copilot/);
  assert.match(html, /<strong>69<\/strong><p>products compared<\/p>/i);
  assert.match(html, /Find the right copilot/i);
  assert.match(html, /Start with your/i);
  assert.match(html, /BUYER’S GUIDE|BUYER CHECKLIST/i);
  assert.match(html, /https:\/\/signalboard\.example\/og\.png/i);
  assert.match(html, /application\/ld\+json/i);
});

test("pre-renders indexable content for every locale", async () => {
  const english = await readDist("index.html");

  // The whole point of pre-rendering: a crawler must see the comparison table,
  // not an empty root element.
  assert.match(english, /<div id="root"><main/);
  assert.ok(english.length > 100_000, `English page unexpectedly small: ${english.length} bytes`);
  assert.match(english, /Final Round AI/);
  assert.match(english, /<html lang="en" dir="ltr">/);

  for (const locale of localeDirs) {
    const html = await readDist(`${locale}/index.html`);
    assert.match(html, /<div id="root"><main/, `${locale} is not pre-rendered`);
    assert.match(html, /Final Round AI/, `${locale} is missing the product table`);
    assert.ok(html.length > 100_000, `${locale} page unexpectedly small`);
  }

  // Arabic is the one right-to-left locale.
  assert.match(await readDist("ar/index.html"), /<html lang="ar" dir="rtl">/);
});

test("discloses the publisher on every locale and never claims independence", async () => {
  for (const locale of ["", ...localeDirs.map((code) => `${code}/`)]) {
    const html = await readDist(`${locale}index.html`);
    assert.match(html, /Autocue/, `${locale || "en"} does not name the publisher`);
    assert.doesNotMatch(
      html,
      /INDEPENDENT GUIDE|Independent interview copilot guide|independently compiled/i,
      `${locale || "en"} still claims independence`,
    );
  }

  // The publisher's own product must never lead a quick-pick row.
  const english = await readDist("index.html");
  assert.doesNotMatch(english, /<h3 lang="en">Autocue/);
});

test("emits the SEO surface: canonical, hreflang, structured data, sitemap", async () => {
  const english = await readDist("index.html");
  const spanish = await readDist("es/index.html");

  assert.match(english, /<link rel="canonical" href="[^"]+\/" \/>/);
  assert.match(spanish, /<link rel="canonical" href="[^"]+\/es\/" \/>/);
  assert.match(english, /hreflang="x-default"/);

  // Every locale must be reachable via a reciprocal alternate from every page.
  for (const locale of [...localeDirs, "en"]) {
    assert.match(english, new RegExp(`hreflang="[^"]*"[^>]*href="[^"]+/${locale === "en" ? "" : `${locale}/`}"`),
      `English page is missing an alternate for ${locale}`);
  }

  // Localised titles and descriptions, not a duplicated English page.
  assert.match(english, /<title>Interview Copilot Guide 2026[^<]*<\/title>/);
  assert.match(spanish, /<title>Guía de copilotos de entrevista 2026[^<]*<\/title>/);
  assert.notEqual(
    /<meta name="description" content="([^"]+)"/.exec(english)?.[1],
    /<meta name="description" content="([^"]+)"/.exec(spanish)?.[1],
  );

  const jsonLd = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(english)?.[1];
  assert.ok(jsonLd, "no JSON-LD block on the English page");
  const graph = JSON.parse(jsonLd)["@graph"];
  const types = graph.map((node) => node["@type"]);
  assert.deepEqual(types, ["Organization", "Organization", "WebSite", "WebPage", "ItemList", "FAQPage"]);
  assert.ok(graph.some((node) => node.name === "Autocue"), "publisher is not disclosed in the structured data");
  assert.equal(graph.find((node) => node["@type"] === "ItemList").numberOfItems, 69);
  assert.ok(graph.find((node) => node["@type"] === "FAQPage").mainEntity.length >= 6);

  const sitemap = await readDist("sitemap.xml");
  for (const locale of localeDirs) {
    assert.match(sitemap, new RegExp(`<loc>[^<]+/${locale}/</loc>`), `sitemap is missing ${locale}`);
  }
  assert.match(sitemap, /hreflang="x-default"/);

  assert.match(await readDist("robots.txt"), /Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
});

test("ships both hosting and GitHub Pages surfaces", async () => {
  const [packageJson, workflow] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"export:github"/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /github-pages-dist/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/favicon.svg", import.meta.url));
  await access(new URL("og.png", distUrl));
  await access(new URL(".nojekyll", distUrl));
  await access(new URL("site.webmanifest", distUrl));
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));

  // The Vite manifest is an internal artefact and must not be published.
  const published = await readdir(distUrl);
  assert.ok(!published.includes(".vite"), "the build left .vite/ in the published output");
});
