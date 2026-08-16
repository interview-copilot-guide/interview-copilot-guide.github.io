/**
 * English is the source dictionary: its shape defines `Messages`, and every
 * other locale file is type-checked against it.
 */
export const en = {
  nav: {
    brandAria: "Interview Copilot Guide home",
    choose: "How to choose",
    directory: "Compare products",
    shortlist: "Quick picks",
    method: "About the guide",
    download: "Download CSV",
    primaryNavAria: "Primary navigation",
    languageAria: "Choose a language",
    languageLabel: "Language",
  },
  disclosure: {
    methodLabel: "About this guide.",
    methodBody: "Records are compiled the same way for every entry, unverifiable fields are marked rather than estimated, and no vendor pays for placement or ordering here.",
  },
  hero: {
    eyebrow: "INTERVIEW COPILOT GUIDE · UPDATED",
    titleLine1: "The interview",
    titleLine2: "copilot",
    titleLine3: "guide.",
    deck: "Compare real-time interview assistants by price, setup, privacy approach, language support and AI model—then narrow the field to the tools that fit your interviews and budget.",
    browse: "Browse {count} tools",
    start: "Start with the basics",
    radarAria: "Interview copilot formats visual",
    radarDesktop: "DESKTOP",
    radarWeb: "WEB",
    radarTechnical: "TECHNICAL",
    radarCoreLabel: "products",
    panelNote: "Scope: products explicitly offering help during a live interview. Prep-only mock interview tools are excluded.",
  },
  metrics: {
    ariaLabel: "Guide highlights",
    products: "products compared",
    median: "typical monthly price",
    desktop: "desktop-capable options",
    free: "with some free access",
    languages: "disclose language support",
  },
  choose: {
    eyebrow: "HOW TO CHOOSE",
    titleLine1: "Six questions before",
    titleLine2: "you compare brands.",
    intro: "The best tool depends on your call setup, interview type and timeline. Answer these questions first, then use the filters to build a relevant shortlist.",
    cards: [
      { title: "Where will it run?", tag: "Browser · desktop · second device", body: "Choose browser access for speed, a desktop app for native overlays, or a second device when you want to keep work and interview screens separate." },
      { title: "What is the interview?", tag: "Behavioral · coding · case · phone", body: "General assistants are not automatically good at code or quantitative work. Match the product focus to the round you are preparing for." },
      { title: "What can you test?", tag: "Audio · latency · answer quality", body: "Use a free allowance in your real meeting setup. A polished demo does not prove that both sides of your call will be captured reliably." },
      { title: "What is actually private?", tag: "Overlay · shared tab · separate screen", body: "Read the delivery details behind any visibility claim. Screen-share behavior differs across operating systems and meeting platforms." },
      { title: "What context can it use?", tag: "Résumé · job description · stories", body: "The strongest answer is usually grounded in your own experience. Check whether the tool can learn your résumé, role and preferred answer style." },
      { title: "How long do you need it?", tag: "One interview · sprint · active search", body: "Prefer a pass or time pack for one round. Monthly plans make more sense for several interviews; annual plans rarely fit a short search." },
    ],
  },
  directory: {
    eyebrow: "PRODUCT COMPARISON GUIDE",
    title: "Find the right copilot.",
    intro: "Filter by setup, price and use case. “Not disclosed” means the detail was not reliably available on the product’s public website or documentation.",
    searchLabel: "Search product, feature or model",
    searchPlaceholder: "Try ‘BYOK’, ‘Claude’, ‘coding’…",
    categoryLabel: "Category",
    deliveryLabel: "Delivery",
    pricingLabel: "Pricing model",
    sortLabel: "Sort",
    reset: "Reset",
    resultCount: "{shown} of {total} products",
    export: "Export current view (.csv)",
    sortOptions: {
      name: "A–Z",
      priceLow: "Monthly price: low first",
      priceHigh: "Monthly price: high first",
      evidence: "Evidence status",
    },
    categories: {
      All: "All",
      General: "General",
      Technical: "Technical",
      Communication: "Communication",
      "Recruiter-side": "Recruiter-side",
      Utility: "Utility",
    },
    deliveries: {
      All: "All",
      Desktop: "Desktop",
      Browser: "Browser",
      "Second device": "Second device",
      Mobile: "Mobile",
    },
    pricingModels: {
      All: "All",
      Subscription: "Subscription",
      "Credits / time": "Credits / time",
      Pass: "Pass",
      Lifetime: "Lifetime",
      BYOK: "BYOK",
      Undisclosed: "Undisclosed",
    },
    headers: {
      product: "Product",
      pricing: "Pricing ladder",
      delivery: "Delivery & platform",
      visibility: "Visibility approach",
      languages: "Languages",
      models: "Models",
      focus: "Focus",
      unique: "Distinctive feature",
    },
    freePrefix: "Free:",
    cardLabels: {
      delivery: "Delivery",
      visibility: "Visibility",
      languages: "Languages",
      models: "Models",
      focus: "Focus",
      unique: "Distinctive",
    },
    emptyTitle: "No exact match.",
    emptyBody: "Clear one or more filters to widen the field.",
    emptyReset: "Reset all filters",
    dataLanguageNote: "Product records below quote each vendor’s own published wording and are kept in English so the source claims stay verifiable. Everything else on this page is translated.",
  },
  shortlist: {
    eyebrow: "QUICK-FIT GUIDE",
    titleLine1: "Start with your",
    titleLine2: "interview situation.",
    intro: "These are useful starting points, not universal winners. Shortlist two or three options, confirm current limits on the vendor’s site, then test the finalists in the same setup you will use on interview day.",
    calloutLabel: "THE SIMPLE RULE",
    calloutNumber: "3",
    calloutText: "tools per shortlist",
    rows: [
      { name: "NO INSTALL", fit: "Browser-first", body: "Useful when you need to begin quickly or cannot install software on your computer." },
      { name: "SECOND DEVICE", fit: "Keep screens separate", body: "Run the assistant on a phone or tablet beside the interview instead of on the shared computer." },
      { name: "CODING ROUND", fit: "Technical support", body: "Prioritize coding-page capture, technical models and support for the platform used in your assessment." },
      { name: "MULTILINGUAL", fit: "Broader language support", body: "Start with products that publish language counts, then test your accent and the exact interview language." },
      { name: "DESKTOP OVERLAY", fit: "Native app", body: "Consider these when overlay controls and desktop meeting capture matter; treat privacy statements as vendor claims." },
      { name: "ONE INTERVIEW", fit: "Short pass or credits", body: "Avoid a long subscription when a non-renewing pass or interview bundle covers the round you already booked." },
    ],
  },
  checklist: {
    eyebrow: "BUYER CHECKLIST",
    titleLine1: "Six checks before",
    titleLine2: "you pay.",
    intro: "A suitable copilot should work in your actual interview setup, fit your interview type and explain its limits clearly. Verify these details before committing.",
    items: [
      { title: "Confirm the setup", body: "Know whether it is a browser tab, extension, native desktop app or second-device workflow—and whether that setup works with your meeting platform." },
      { title: "Test both audio channels", body: "A useful trial must hear both you and the interviewer. Test with headphones, your usual microphone and the same conferencing app." },
      { title: "Read privacy claims carefully", body: "“Invisible” and “undetectable” are vendor claims. Screen sharing, recording and employer monitoring can behave differently across systems." },
      { title: "Calculate the real allowance", body: "Compare live minutes, credits, session caps and expiry—not only the monthly sticker. Check the fair-use policy behind “unlimited.”" },
      { title: "Use your real context", body: "Prefer tools that can ground suggestions in your résumé, job description and true examples instead of producing generic answers." },
      { title: "Verify specialist support", body: "For coding, case, quantitative or multilingual interviews, test the exact model, language and workflow you need before interview day." },
    ],
  },
  faq: {
    eyebrow: "COMMON QUESTIONS",
    title: "Questions readers ask.",
    items: [
      { q: "What is a real-time interview copilot?", a: "It is software that listens to a live job interview and suggests answers, structure or reminders while the conversation is happening. That is different from a mock-interview trainer, which only helps you rehearse beforehand." },
      { q: "How much does an interview copilot cost?", a: "Most recurring plans in this guide sit between roughly $20 and $100 per month, and several vendors also sell single-interview passes, minute packs or lifetime licences. Compare the live-minute allowance rather than the monthly sticker price." },
      { q: "Are interview copilots really undetectable during screen sharing?", a: "Treat every “invisible” or “undetectable” statement as a vendor claim, not a tested fact. Behaviour varies by operating system, conferencing app, capture mode and any monitoring software an employer runs. Nothing in this guide has been independently penetration-tested." },
      { q: "Is it acceptable to use an AI copilot in an interview?", a: "Employer policies differ, and concealed answer generation may breach the rules of the process you are in. The lower-risk use is private preparation and recall coaching grounded in your own real experience." },
      { q: "Which interview copilot is best for coding interviews?", a: "Look for products that explicitly capture the coding page, name the technical models they use and support the assessment platform in your invitation. Filter this guide to the Technical category to see those options." },
      { q: "Do these tools work in languages other than English?", a: "Many publish a supported-language count, and some claim dozens of live transcription languages. Support quality varies a lot by accent and by interview vocabulary, so test the exact language you will interview in before you pay." },
      { q: "Can I use an interview copilot on a second device?", a: "Yes. Several products run in a phone or tablet browser so the assistant never appears on the computer you share. Use the Delivery filter to find second-device options." },
      { q: "How was this guide compiled?", a: "Every record was taken from the vendor’s own public site, documentation or pricing page and labelled with an evidence status. Fields that could not be verified are marked as not disclosed rather than estimated." },
    ],
  },
  method: {
    eyebrow: "HOW TO USE THIS GUIDE",
    title: "What the labels mean.",
    paragraphs: [
      { label: "Scope.", body: "Candidate-side products that explicitly offer assistance during a real live interview. Mock-only preparation products are excluded. A few recruiter-side or overlay utilities are retained and labeled “Adjacent” to show neighboring pricing." },
      { label: "Sources.", body: "Official product, documentation and pricing pages were preferred. “Mixed” indicates that part of a ladder required a recent public cross-check because the official checkout was dynamic or incomplete." },
      { label: "Invisibility.", body: "Every screen-share or stealth statement is a vendor claim, not an independent security test. Actual behavior varies by operating system, conferencing software, capture mode and employer monitoring." },
      { label: "Ethics.", body: "Employer policies differ. Using concealed answer generation may violate interview rules. The more durable product position is a private recall and communication coach grounded in the candidate’s real experience." },
      { label: "Currency.", body: "USD unless a different symbol is shown. Monthly medians use products with a directly comparable recurring monthly sticker and exclude one-time time packs." },
    ],
  },
  footer: {
    tagline: "Interview copilot guide · Updated",
    backToTop: "Back to top",
  },
  seo: {
    title: "Interview Copilot Guide 2026 — Compare 69 Real-Time AI Interview Assistants",
    shortTitle: "Interview Copilot Guide",
    description: "Compare 69 real-time AI interview copilots and live interview assistants: pricing, free plans, desktop vs browser, privacy claims, languages and AI models. Updated August 2026.",
    ogTitle: "Interview Copilot Guide 2026 — Compare 69 Real-Time AI Interview Assistants",
    ogDescription: "Compare pricing, setup, privacy approach, languages and models across 69 real-time AI interview assistants. Source-linked and reviewed in August 2026.",
    keywords: "interview copilot, AI interview assistant, real time interview assistant, real-time interview AI, live interview assistant, AI interview helper, interview AI comparison, best interview copilot 2026, interview copilot pricing, AI assistant for job interviews, coding interview AI assistant, technical interview copilot, interview transcription AI, AI answers during interview, undetectable interview assistant, screen share safe interview assistant, second device interview assistant, multilingual interview assistant, interview copilot free trial, interview copilot alternatives",
    imageAlt: "Interview Copilot Guide — comparison of real-time AI interview assistants",
  },
} as const;

/**
 * Widens the `as const` literal types of the English source back to `string`
 * so that translations only have to match the *shape*, not the exact wording.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly Widen<Item>[]
    : { -readonly [Key in keyof T]: Widen<T[Key]> };

export type Messages = Widen<typeof en>;
