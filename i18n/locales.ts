export type LocaleCode =
  | "en" | "es" | "zh" | "hi" | "ar" | "pt" | "fr" | "de" | "ja" | "ko" | "ru";

export type LocaleConfig = {
  /** Directory segment used on GitHub Pages. English is served from the root. */
  code: LocaleCode;
  /** Value for <html lang>. */
  htmlLang: string;
  /** Value for hreflang alternates — regionless where a script tag is enough. */
  hreflang: string;
  /** Value for <html dir>. */
  dir: "ltr" | "rtl";
  /** Endonym shown in the language switcher. */
  label: string;
  /** English name, used for aria-labels and the sitemap comments. */
  englishName: string;
  /** BCP-47 tag used for Intl number formatting. */
  numberLocale: string;
  /** og:locale value. */
  ogLocale: string;
};

export const locales: LocaleConfig[] = [
  { code: "en", htmlLang: "en", hreflang: "en", dir: "ltr", label: "English", englishName: "English", numberLocale: "en-US", ogLocale: "en_US" },
  { code: "es", htmlLang: "es", hreflang: "es", dir: "ltr", label: "Español", englishName: "Spanish", numberLocale: "es-ES", ogLocale: "es_ES" },
  { code: "zh", htmlLang: "zh-Hans", hreflang: "zh-Hans", dir: "ltr", label: "简体中文", englishName: "Chinese (Simplified)", numberLocale: "zh-CN", ogLocale: "zh_CN" },
  { code: "hi", htmlLang: "hi", hreflang: "hi", dir: "ltr", label: "हिन्दी", englishName: "Hindi", numberLocale: "hi-IN", ogLocale: "hi_IN" },
  { code: "ar", htmlLang: "ar", hreflang: "ar", dir: "rtl", label: "العربية", englishName: "Arabic", numberLocale: "ar", ogLocale: "ar_AR" },
  { code: "pt", htmlLang: "pt-BR", hreflang: "pt-BR", dir: "ltr", label: "Português", englishName: "Portuguese (Brazil)", numberLocale: "pt-BR", ogLocale: "pt_BR" },
  { code: "fr", htmlLang: "fr", hreflang: "fr", dir: "ltr", label: "Français", englishName: "French", numberLocale: "fr-FR", ogLocale: "fr_FR" },
  { code: "de", htmlLang: "de", hreflang: "de", dir: "ltr", label: "Deutsch", englishName: "German", numberLocale: "de-DE", ogLocale: "de_DE" },
  { code: "ja", htmlLang: "ja", hreflang: "ja", dir: "ltr", label: "日本語", englishName: "Japanese", numberLocale: "ja-JP", ogLocale: "ja_JP" },
  { code: "ko", htmlLang: "ko", hreflang: "ko", dir: "ltr", label: "한국어", englishName: "Korean", numberLocale: "ko-KR", ogLocale: "ko_KR" },
  { code: "ru", htmlLang: "ru", hreflang: "ru", dir: "ltr", label: "Русский", englishName: "Russian", numberLocale: "ru-RU", ogLocale: "ru_RU" },
];

export const defaultLocale: LocaleCode = "en";

export const localeCodes = locales.map((locale) => locale.code);

export function getLocaleConfig(code: LocaleCode): LocaleConfig {
  const match = locales.find((locale) => locale.code === code);
  if (!match) throw new Error(`Unknown locale: ${code}`);
  return match;
}

/** Site-root-relative path for a locale. English lives at "/", others at "/<code>/". */
export function localePath(code: LocaleCode): string {
  return code === defaultLocale ? "/" : `/${code}/`;
}

/** Absolute URL for a locale, given the deployed site origin. */
export function localeUrl(siteUrl: string, code: LocaleCode): string {
  return `${siteUrl.replace(/\/$/, "")}${localePath(code)}`;
}
