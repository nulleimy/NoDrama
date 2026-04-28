"use client";

import { useLang } from "@/components/i18n/LanguageProvider";

export default function LanguageSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex gap-1 rounded-full border border-neutral-200 bg-white/90 p-1 text-xs font-black shadow-sm backdrop-blur">
      <button
        type="button"
        onClick={() => setLang("cs")}
        className={`rounded-full px-3 py-2 ${lang === "cs" ? "bg-black text-white" : "text-neutral-500"}`}
      >
        CZ
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-2 ${lang === "en" ? "bg-black text-white" : "text-neutral-500"}`}
      >
        EN
      </button>
    </div>
  );
}
