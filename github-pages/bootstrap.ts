import type { LocaleCode, Messages } from "@/i18n";

/** Payload the pre-rendered HTML embeds so the client hydrates the same tree. */
export type Bootstrap = {
  locale: LocaleCode;
  basePath: string;
  messages: Messages;
};

export const bootstrapGlobal = "__COPILOT_GUIDE__";

declare global {
  interface Window {
    __COPILOT_GUIDE__?: Bootstrap;
  }
}
