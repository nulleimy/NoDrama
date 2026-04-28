"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/components/i18n/LanguageProvider";
import { Lang } from "@/lib/i18n/languages";
import { localizePathname } from "@/lib/i18n/pathLocale";

export default function LanguageSwitch() {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const router = useRouter();

  const switchLang = (nextLang: Lang) => {
    setLang(nextLang);
    router.replace(localizePathname(pathname, nextLang));
  };

  return (
    <div className="flex gap-1 rounded-full border border-neutral-200 bg-white/90 p-1 text-xs font-black shadow-sm backdrop-blur">
      <button
        type="button"
        onClick={() => switchLang("cs")}
        className={`rounded-full px-3 py-2 ${lang === "cs" ? "bg-black text-white" : "text-neutral-500"}`}
      >
        CZ
      </button>
      <button
        type="button"
        onClick={() => switchLang("en")}
        className={`rounded-full px-3 py-2 ${lang === "en" ? "bg-black text-white" : "text-neutral-500"}`}
      >
        EN
      </button>
    </div>
  );
}
