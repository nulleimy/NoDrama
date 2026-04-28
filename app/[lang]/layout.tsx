import { notFound } from "next/navigation";
import { SUPPORTED_LANGS } from "@/lib/i18n/languages";

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!SUPPORTED_LANGS.includes(lang as (typeof SUPPORTED_LANGS)[number])) {
    notFound();
  }

  return children;
}
