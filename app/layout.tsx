import "./globals.css";
import { cookies } from "next/headers";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { normalizeLang } from "@/lib/i18n/pathLocale";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const htmlLang = normalizeLang(cookieStore.get("lang")?.value);

  return (
    <html lang={htmlLang}>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
              <LanguageSwitch />
            </div>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
