import { Lang } from "./languages";

export function detectLang(): Lang {
  if (typeof window === "undefined") return "cs";

  const saved = localStorage.getItem("lang");
  if (saved === "cs" || saved === "en") return saved

  const langs = navigator.languages || [navigator.language];

  if (langs.some(l => l.toLowerCase().startsWith("cs"))) {
    return "cs";
  }

  return "en";
}
