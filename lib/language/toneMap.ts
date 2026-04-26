import type { ReplyStyle } from "@/lib/language/phraseTypes";

export function mapUiToneToReplyStyle(tone: string): ReplyStyle {
  if (tone === "Milý") return "casual";
  if (tone === "Asertivní") return "firm";
  if (tone === "Formální") return "formal";
  if (tone === "Vtipný") return "funny";
  return "neutral";
}
