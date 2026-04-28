import { DEFAULT_LANG, Lang, SUPPORTED_LANGS } from "./languages";

function isSupportedLang(value: string): value is Lang {
  return SUPPORTED_LANGS.includes(value as Lang);
}

export function getLocaleFromPathname(pathname: string): Lang | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return null;
  return isSupportedLang(segment) ? segment : null;
}

export function stripLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;

  const stripped = pathname.replace(new RegExp(`^/${locale}`), "");
  return stripped.length > 0 ? stripped : "/";
}

export function localizePathname(pathname: string, lang: Lang): string {
  const stripped = stripLocalePrefix(pathname);
  if (stripped === "/") return `/${lang}`;
  return `/${lang}${stripped}`;
}

export function normalizeLang(value: string | null | undefined): Lang {
  if (value && isSupportedLang(value)) return value;
  return DEFAULT_LANG;
}
