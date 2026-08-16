import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { MarketResearch } from "../app/MarketResearch";
import { defaultLocale, getMessages } from "../i18n";
import type { Bootstrap } from "./bootstrap";
import "../app/globals.css";

const fallback: Bootstrap = {
  locale: defaultLocale,
  basePath: "/",
  messages: getMessages(defaultLocale),
};

const bootstrap = window.__COPILOT_GUIDE__ ?? fallback;
const container = document.getElementById("root");

if (container) {
  hydrateRoot(
    container,
    <StrictMode>
      <MarketResearch
        locale={bootstrap.locale}
        messages={bootstrap.messages}
        basePath={bootstrap.basePath}
      />
    </StrictMode>,
  );
}
