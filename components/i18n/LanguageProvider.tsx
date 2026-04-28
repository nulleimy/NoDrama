"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { Lang } from "@/lib/i18n/languages";
import { getLocaleFromPathname, normalizeLang } from "@/lib/i18n/pathLocale";

function detectStoredLang(): Lang {
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
  const pathname = usePathname();
  const [storedLang, setStoredLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "cs";
    return detectStoredLang();
  });

  const pathLang = getLocaleFromPathname(pathname);
  const lang = pathLang ?? storedLang;

  const setLang = (nextLang: Lang) => {
    const safeLang = normalizeLang(nextLang);
    window.localStorage.setItem("lang", safeLang);
    document.cookie = `lang=${safeLang}; path=/; max-age=31536000; samesite=lax`;
    setStoredLang(safeLang);
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
