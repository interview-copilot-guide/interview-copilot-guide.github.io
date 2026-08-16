/**
 * Builds the static GitHub Pages site.
 *
 *   1. client bundle  -> github-pages-dist/assets/*  (+ manifest)
 *   2. SSR renderer   -> node_modules/.cache/copilot-guide-ssr
 *   3. one pre-rendered HTML document per locale, plus sitemap.xml,
 *      robots.txt and the web manifest.
 *
 * Pre-rendering is what makes the guide indexable: a crawler receives the full
 * comparison table and copy in its own language instead of an empty <div>.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import react from "@vitejs/plugin-react";
import { build } from "vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesRoot = path.join(projectRoot, "github-pages");
const outDir = path.join(projectRoot, "github-pages-dist");
const ssrDir = path.join(projectRoot, "node_modules/.cache/copilot-guide-ssr");

const siteUrl = (process.env.VITE_SITE_URL || "http://localhost:4173").replace(/\/+$/, "");
const basePath = process.env.GITHUB_PAGES_BASE || "/";

const shared = {
  configFile: false,
  root: pagesRoot,
  base: basePath,
  mode: "production",
  logLevel: "warn",
  plugins: [react()],
  resolve: { alias: { "@": projectRoot } },
};

const clientConfig = {
  ...shared,
  publicDir: path.join(projectRoot, "public"),
  build: {
    outDir,
    emptyOutDir: true,
    sourcemap: false,
    manifest: true,
    rollupOptions: { input: path.join(pagesRoot, "entry-client.tsx") },
  },
};

const ssrConfig = {
  ...shared,
  publicDir: false,
  build: {
    outDir: ssrDir,
    emptyOutDir: true,
    sourcemap: false,
    ssr: path.join(pagesRoot, "entry-server.tsx"),
  },
};

/** Reads Vite's manifest to find the hashed asset names for the client entry. */
async function readEntryAssets() {
  const manifest = JSON.parse(await readFile(path.join(outDir, ".vite", "manifest.json"), "utf8"));
  const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
  if (!entry) throw new Error("No entry chunk found in the client manifest.");

  const withBase = (file) => `${basePath}/${file}`.replace(/\/{2,}/g, "/");
  return {
    scripts: [withBase(entry.file)],
    stylesheets: (entry.css ?? []).map(withBase),
  };
}

await build(clientConfig);
await build(ssrConfig);

const { scripts, stylesheets } = await readEntryAssets();
const { renderPage, locales, defaultLocale, localePath, buildSitemap, buildRobotsTxt, buildWebManifest } =
  await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

for (const locale of locales) {
  const html = renderPage({ locale: locale.code, siteUrl, basePath, scripts, stylesheets });
  const directory = locale.code === defaultLocale ? outDir : path.join(outDir, locale.code);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html, "utf8");
  console.log(`  rendered ${localePath(locale.code).padEnd(6)} ${locale.englishName}`);
}

await writeFile(path.join(outDir, "sitemap.xml"), buildSitemap(siteUrl), "utf8");
await writeFile(path.join(outDir, "robots.txt"), buildRobotsTxt(siteUrl), "utf8");
await writeFile(path.join(outDir, "site.webmanifest"), buildWebManifest(), "utf8");
await writeFile(path.join(outDir, ".nojekyll"), "", "utf8");

// The manifest is a build artefact; it does not belong on the public site.
await rm(path.join(outDir, ".vite"), { recursive: true, force: true });

console.log(`\n  ${locales.length} locales -> ${path.relative(projectRoot, outDir)}  (site: ${siteUrl})`);
