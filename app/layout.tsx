import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
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
