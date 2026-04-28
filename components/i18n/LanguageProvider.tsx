"use client";

import { createContext, useContext, useState } from "react";

export type Lang = "cs" | "en";

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "cs";

  const saved = window.localStorage.getItem("lang");
  if (saved === "cs" || saved === "en") return saved;

  const browserLanguages = window.navigator.languages || [window.navigator.language];
  if (browserLanguages.some((item) => item.toLowerCase().startsWith("cs"))) {
    return "cs";
  }

  return "en";
}

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({
  lang: "cs",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  const setLang = (nextLang: Lang) => {
    window.localStorage.setItem("lang", nextLang);
    setLangState(nextLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
