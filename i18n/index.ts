import { en, type Messages } from "./messages/en";
import { es } from "./messages/es";
import { zh } from "./messages/zh";
import { hi } from "./messages/hi";
import { ar } from "./messages/ar";
import { pt } from "./messages/pt";
import { fr } from "./messages/fr";
import { de } from "./messages/de";
import { ja } from "./messages/ja";
import { ko } from "./messages/ko";
import { ru } from "./messages/ru";
import { defaultLocale, type LocaleCode } from "./locales";

export type { Messages } from "./messages/en";
export * from "./locales";

const dictionaries: Record<LocaleCode, Messages> = { en, es, zh, hi, ar, pt, fr, de, ja, ko, ru };

export function getMessages(locale: LocaleCode): Messages {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Replaces `{name}` placeholders. Values are stringified as-is. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
