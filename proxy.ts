import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LANG } from "@/lib/i18n/languages";
import { getLocaleFromPathname, normalizeLang } from "@/lib/i18n/pathLocale";

function detectPreferredLang(request: NextRequest) {
  const saved = request.cookies.get("lang")?.value;
  if (saved) return normalizeLang(saved);

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  if (acceptLanguage.includes("cs")) return "cs";
  if (acceptLanguage.includes("en")) return "en";

  return DEFAULT_LANG;
}

function shouldBypass(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/account") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const pathnameLocale = getLocaleFromPathname(pathname);

  if (pathnameLocale) {
    const response = NextResponse.next();
    response.cookies.set("lang", pathnameLocale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return response;
  }

  const lang = detectPreferredLang(request);
  const localizedPath = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  const redirectUrl = new URL(localizedPath, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
