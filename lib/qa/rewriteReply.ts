import { QaContext } from "./qaTypes";

export function rewriteReply(text: string, ctx: QaContext): string {
  void ctx;
  if (text.length < 10) {
    return text + " — můžu to víc rozvést.";
  }
  return text;
}
