import "./globals.css";
import { cookies } from "next/headers";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { normalizeLang } from "@/lib/i18n/pathLocale";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const htmlLang = normalizeLang(cookieStore.get("lang")?.value);

  return (
    <html lang={htmlLang}>
      <body>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
