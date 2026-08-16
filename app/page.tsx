import { defaultLocale, getMessages } from "@/i18n";
import { MarketResearch } from "./MarketResearch";

export default function Home() {
  return <MarketResearch locale={defaultLocale} messages={getMessages(defaultLocale)} />;
}
