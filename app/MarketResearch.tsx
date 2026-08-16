"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import { products, researchDate, type Product } from "@/data/products";
import { format, getLocaleConfig, locales, localePath, type LocaleCode, type Messages } from "@/i18n";

/**
 * Canonical filter values. These are matched against the English product data,
 * so they must never be translated — only their labels are.
 */
const categoryValues = ["All", "General", "Technical", "Communication", "Recruiter-side", "Utility"] as const;
const deliveryValues = ["All", "Desktop", "Browser", "Second device", "Mobile"] as const;
const pricingValues = ["All", "Subscription", "Credits / time", "Pass", "Lifetime", "BYOK", "Undisclosed"] as const;

type SortKey = "name" | "price-low" | "price-high" | "evidence";

/**
 * Product names quoted in the quick-fit guide; brand names are never translated.
 *
 * Ordering rule, stated in the disclosure so readers can check it: names are
 * alphabetical, except Autocue — the publisher's own product — which is always
 * listed last in its row so the publisher never appears as a top pick.
 */
const shortlistExamples = [
  "Interviews Chat · Parakeet AI · Autocue",
  "Interviews Chat · Parakeet AI · Autocue",
  "Final Round AI · Sensei AI · Verve AI",
  "CoPrep AI · Parakeet AI · Autocue",
  "Beyz AI · LockedIn AI · WinItAI",
  "AceRound · InterviewBee · Autocue",
];

/** Fields a visitor can meaningfully search. Excludes `id` and `url` so that
 *  slug fragments and the literal string "null" cannot produce phantom hits. */
const searchableFields: (keyof Product)[] = [
  "name", "category", "pricing", "priceModel", "freeAccess", "delivery",
  "platforms", "visibility", "languages", "models", "focus", "unique", "evidence",
];

function median(values: number[]) {
  const ordered = [...values].sort((a, b) => a - b);
  if (!ordered.length) return 0;
  const midpoint = Math.floor(ordered.length / 2);
  return ordered.length % 2
    ? ordered[midpoint]
    : (ordered[midpoint - 1] + ordered[midpoint]) / 2;
}

function formatPrice(value: number) {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function deliveryMatches(product: Product, selected: string) {
  if (selected === "All") return true;
  const haystack = `${product.delivery} ${product.platforms}`.toLowerCase();
  if (selected === "Second device") return haystack.includes("second") || haystack.includes("phone");
  return haystack.includes(selected.toLowerCase());
}

function pricingMatches(product: Product, selected: string) {
  if (selected === "All") return true;
  const value = product.priceModel.toLowerCase();
  if (selected === "Credits / time") return value.includes("credit") || value.includes("time") || value.includes("minute") || value.includes("hour");
  return value.includes(selected.toLowerCase());
}

function compareProducts(sortBy: SortKey) {
  return (a: Product, b: Product) => {
    if (sortBy === "price-low") return (a.monthlyUsd ?? Number.POSITIVE_INFINITY) - (b.monthlyUsd ?? Number.POSITIVE_INFINITY);
    if (sortBy === "price-high") return (b.monthlyUsd ?? -1) - (a.monthlyUsd ?? -1);
    if (sortBy === "evidence") return a.evidence.localeCompare(b.evidence) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  };
}

function csvEscape(value: string | number | null) {
  const stringValue = value === null ? "" : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function downloadCsv(rows: Product[]) {
  const headers: (keyof Product)[] = [
    "name", "category", "pricing", "priceModel", "monthlyUsd", "freeAccess", "delivery",
    "platforms", "visibility", "languages", "models", "focus", "unique", "evidence", "url",
  ];
  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((key) => csvEscape(row[key] as string | number | null)).join(",")),
  ].join("\r\n");
  // The BOM keeps Excel from mis-decoding the typographic punctuation in the data.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "interview-copilot-guide-2026.csv";
  // Firefox only honours programmatic clicks on anchors that are in the document,
  // and revoking the URL synchronously can cancel the download in some browsers.
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Like `format`, but substitutes React nodes so placeholders can carry markup.
 *  Needed because locales place `{shown}` and `{total}` in different orders. */
function formatParts(template: string, values: Record<string, ReactNode>) {
  return template.split(/(\{\w+\})/g).map((part, index) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return <Fragment key={index}>{key && key in values ? values[key] : part}</Fragment>;
  });
}

function EvidencePill({ value }: { value: Product["evidence"] }) {
  return <span className={`evidence evidence-${value.toLowerCase().replaceAll(" ", "-")}`}>{value}</span>;
}

function LanguageSwitcher({ locale, messages, basePath, className }: {
  locale: LocaleCode;
  messages: Messages;
  basePath: string;
  className: string;
}) {
  const current = getLocaleConfig(locale);
  return (
    <details className={className}>
      <summary aria-label={messages.nav.languageAria}>
        <span aria-hidden="true">🌐</span> {current.label}
      </summary>
      <ul>
        {locales.map((item) => (
          <li key={item.code}>
            <a
              href={`${basePath}${localePath(item.code).slice(1)}`}
              hrefLang={item.hreflang}
              lang={item.htmlLang}
              aria-current={item.code === locale ? "page" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function MarketResearch({ locale, messages, basePath = "/" }: {
  locale: LocaleCode;
  messages: Messages;
  basePath?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [delivery, setDelivery] = useState("All");
  const [pricingModel, setPricingModel] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("name");

  const recurringPrices = products.flatMap((product) => product.monthlyUsd === null ? [] : [product.monthlyUsd]);
  const marketMedian = median(recurringPrices);
  const freeCount = products.filter((product) => !/no clear|not disclosed|paid access|product demo|app-store listing|no free live/i.test(product.freeAccess)).length;
  const desktopCount = products.filter((product) => /desktop|macos|windows/i.test(`${product.delivery} ${product.platforms}`)).length;
  const languageCount = products.filter((product) => !/not publicly|not applicable/i.test(product.languages)).length;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = products.filter((product) => {
      const searchable = searchableFields.map((field) => product[field]).join(" ").toLowerCase();
      return (!normalized || searchable.includes(normalized))
        && (category === "All" || product.category === category)
        && deliveryMatches(product, delivery)
        && pricingMatches(product, pricingModel);
    });
    // toSorted() leaves the filtered array unmutated, which keeps this memo pure.
    return matches.toSorted(compareProducts(sortBy));
  }, [query, category, delivery, pricingModel, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setDelivery("All");
    setPricingModel("All");
    setSortBy("name");
  };

  const t = messages;

  return (
    <main>
      <nav className="topbar" aria-label={t.nav.primaryNavAria}>
        <a className="brand" href="#top" aria-label={t.nav.brandAria}>
          <span className="brand-mark">S</span>
          <span>SIGNALBOARD <em>/ 26</em></span>
        </a>
        <div className="nav-links">
          <a href="#choose">{t.nav.choose}</a>
          <a href="#directory">{t.nav.directory}</a>
          <a href="#shortlist">{t.nav.shortlist}</a>
          <a href="#method">{t.nav.method}</a>
        </div>
        <div className="nav-tools">
          <LanguageSwitcher className="lang-switch" locale={locale} messages={t} basePath={basePath} />
          <button className="nav-download" onClick={() => downloadCsv(filtered)}>{t.nav.download} ↘</button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> {t.hero.eyebrow} {researchDate.toUpperCase()}</p>
          <h1>{t.hero.titleLine1}<br /><i>{t.hero.titleLine2}</i><br />{t.hero.titleLine3}</h1>
          <p className="hero-deck">{t.hero.deck}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#directory">{format(t.hero.browse, { count: products.length })} <span>↓</span></a>
            <a className="secondary-action" href="#choose">{t.hero.start}</a>
          </div>
        </div>
        <div className="hero-panel">
          <div className="radar" aria-label={t.hero.radarAria}>
            <div className="radar-ring ring-one" />
            <div className="radar-ring ring-two" />
            <div className="radar-ring ring-three" />
            <div className="radar-axis axis-x" />
            <div className="radar-axis axis-y" />
            <span className="radar-dot dot-one" />
            <span className="radar-dot dot-two" />
            <span className="radar-dot dot-three" />
            <span className="radar-dot dot-four" />
            <span className="radar-dot dot-five" />
            <span className="radar-label label-one">{t.hero.radarDesktop}</span>
            <span className="radar-label label-two">{t.hero.radarWeb}</span>
            <span className="radar-label label-three">{t.hero.radarTechnical}</span>
            <div className="radar-core"><strong>{products.length}</strong><span>{t.hero.radarCoreLabel}</span></div>
          </div>
          <p className="panel-note">{t.hero.panelNote}</p>
        </div>
      </section>

      <section className="metric-strip" aria-label={t.metrics.ariaLabel}>
        <article><span>01</span><strong>{products.length}</strong><p>{t.metrics.products}</p></article>
        <article><span>02</span><strong>{formatPrice(marketMedian)}</strong><p>{t.metrics.median}</p></article>
        <article><span>03</span><strong>{desktopCount}</strong><p>{t.metrics.desktop}</p></article>
        <article><span>04</span><strong>{freeCount}</strong><p>{t.metrics.free}</p></article>
        <article><span>05</span><strong>{languageCount}</strong><p>{t.metrics.languages}</p></article>
      </section>

      <section className="section market-section" id="choose">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> {t.choose.eyebrow}</p>
            <h2>{t.choose.titleLine1}<br />{t.choose.titleLine2}</h2>
          </div>
          <p>{t.choose.intro}</p>
        </div>
        <div className="strategy-grid">
          {t.choose.cards.map((card, index) => (
            <article className="strategy-card" key={card.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{card.title}</h3>
              <strong>{card.tag}</strong>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section directory-section" id="directory">
        <div className="section-heading directory-heading">
          <div>
            <p className="eyebrow dark"><span /> {t.directory.eyebrow}</p>
            <h2>{t.directory.title}</h2>
          </div>
          <p>{t.directory.intro}</p>
        </div>

        <div className="filter-panel">
          <label className="search-field">
            <span>{t.directory.searchLabel}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.directory.searchPlaceholder} />
          </label>
          <label><span>{t.directory.categoryLabel}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categoryValues.map((item) => <option key={item} value={item}>{t.directory.categories[item]}</option>)}
            </select>
          </label>
          <label><span>{t.directory.deliveryLabel}</span>
            <select value={delivery} onChange={(event) => setDelivery(event.target.value)}>
              {deliveryValues.map((item) => <option key={item} value={item}>{t.directory.deliveries[item]}</option>)}
            </select>
          </label>
          <label><span>{t.directory.pricingLabel}</span>
            <select value={pricingModel} onChange={(event) => setPricingModel(event.target.value)}>
              {pricingValues.map((item) => <option key={item} value={item}>{t.directory.pricingModels[item]}</option>)}
            </select>
          </label>
          <label><span>{t.directory.sortLabel}</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortKey)}>
              <option value="name">{t.directory.sortOptions.name}</option>
              <option value="price-low">{t.directory.sortOptions.priceLow}</option>
              <option value="price-high">{t.directory.sortOptions.priceHigh}</option>
              <option value="evidence">{t.directory.sortOptions.evidence}</option>
            </select>
          </label>
          <button onClick={clearFilters}>{t.directory.reset}</button>
        </div>

        <div className="result-bar">
          <p>{formatParts(t.directory.resultCount, { shown: <strong>{filtered.length}</strong>, total: products.length })}</p>
          <button onClick={() => downloadCsv(filtered)}>{t.directory.export} ↘</button>
        </div>

        {locale !== "en" && <p className="data-language-note">{t.directory.dataLanguageNote}</p>}

        <div className="table-shell">
          <table className="product-table">
            <colgroup>
              <col /><col /><col /><col /><col /><col /><col /><col />
            </colgroup>
            <thead>
              <tr>
                <th>{t.directory.headers.product}</th>
                <th>{t.directory.headers.pricing}</th>
                <th>{t.directory.headers.delivery}</th>
                <th>{t.directory.headers.visibility}</th>
                <th>{t.directory.headers.languages}</th>
                <th>{t.directory.headers.models}</th>
                <th>{t.directory.headers.focus}</th>
                <th>{t.directory.headers.unique}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, index) => (
                <tr key={product.id}>
                  <td>
                    <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
                    <a href={product.url} target="_blank" rel="noreferrer nofollow">{product.name} ↗</a>
                    <span className="category-label">{t.directory.categories[product.category]}</span>
                    <EvidencePill value={product.evidence} />
                  </td>
                  <td lang="en"><strong>{product.priceModel}</strong><p>{product.pricing}</p><small>{t.directory.freePrefix} {product.freeAccess}</small></td>
                  <td lang="en"><strong>{product.delivery}</strong><p>{product.platforms}</p></td>
                  <td lang="en">{product.visibility}</td>
                  <td lang="en">{product.languages}</td>
                  <td lang="en">{product.models}</td>
                  <td lang="en">{product.focus}</td>
                  <td lang="en">{product.unique}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <strong>{t.directory.emptyTitle}</strong>
              <p>{t.directory.emptyBody}</p>
              <button onClick={clearFilters}>{t.directory.emptyReset}</button>
            </div>
          )}
        </div>

        <div className="mobile-cards">
          {filtered.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-card-top">
                <div>
                  <span>{t.directory.categories[product.category]}</span>
                  <a href={product.url} target="_blank" rel="noreferrer nofollow">{product.name} ↗</a>
                </div>
                <EvidencePill value={product.evidence} />
              </div>
              <h3 lang="en">{product.priceModel}</h3>
              <p className="card-price" lang="en">{product.pricing}</p>
              <dl>
                <div><dt>{t.directory.cardLabels.delivery}</dt><dd lang="en">{product.delivery} · {product.platforms}</dd></div>
                <div><dt>{t.directory.cardLabels.visibility}</dt><dd lang="en">{product.visibility}</dd></div>
                <div><dt>{t.directory.cardLabels.languages}</dt><dd lang="en">{product.languages}</dd></div>
                <div><dt>{t.directory.cardLabels.models}</dt><dd lang="en">{product.models}</dd></div>
                <div><dt>{t.directory.cardLabels.focus}</dt><dd lang="en">{product.focus}</dd></div>
                <div><dt>{t.directory.cardLabels.unique}</dt><dd lang="en">{product.unique}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-recommendation" id="shortlist">
        <div className="pricing-intro">
          <p className="eyebrow"><span /> {t.shortlist.eyebrow}</p>
          <h2>{t.shortlist.titleLine1}<br /><i>{t.shortlist.titleLine2}</i></h2>
          <p>{t.shortlist.intro}</p>
          <div className="pricing-callout">
            <span>{t.shortlist.calloutLabel}</span>
            <strong>{t.shortlist.calloutNumber}</strong>
            <p>{t.shortlist.calloutText}</p>
          </div>
        </div>
        <div className="ladder">
          {t.shortlist.rows.map((row, index) => (
            <article className="ladder-row" key={row.name}>
              <span className="ladder-index">0{index + 1}</span>
              <div><small>{row.name}</small><strong>{row.fit}</strong></div>
              <h3 lang="en">{shortlistExamples[index]}</h3>
              <p>{row.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section implication-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> {t.checklist.eyebrow}</p>
            <h2>{t.checklist.titleLine1}<br />{t.checklist.titleLine2}</h2>
          </div>
          <p>{t.checklist.intro}</p>
        </div>
        <div className="implication-grid">
          {t.checklist.items.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> {t.faq.eyebrow}</p>
            <h2>{t.faq.title}</h2>
          </div>
          <p>{t.hero.panelNote}</p>
        </div>
        <div className="faq-list">
          {t.faq.items.map((item) => (
            <article className="faq-item" key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="method-section" id="method">
        <div>
          <p className="eyebrow"><span /> {t.method.eyebrow}</p>
          <h2>{t.method.title}</h2>
        </div>
        <div className="method-copy">
          <p><strong>{t.disclosure.methodLabel}</strong> {t.disclosure.methodBody}</p>
          {t.method.paragraphs.map((paragraph) => (
            <p key={paragraph.label}><strong>{paragraph.label}</strong> {paragraph.body}</p>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="brand"><span className="brand-mark">S</span><span>SIGNALBOARD <em>/ 26</em></span></div>
          <p>{t.footer.tagline} {researchDate}</p>
          <a href="#top">{t.footer.backToTop} ↑</a>
        </div>
        <nav className="footer-langs" aria-label={t.nav.languageAria}>
          <span>{t.nav.languageLabel}:</span>
          {locales.map((item) => (
            <a
              key={item.code}
              href={`${basePath}${localePath(item.code).slice(1)}`}
              hrefLang={item.hreflang}
              lang={item.htmlLang}
              aria-current={item.code === locale ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
