export function rewriteReply(text: string, ctx: any): string {
  if (text.length < 20) {
    return ctx.language === "cs"
      ? "Nestíhám to teď řešit, dám ti konkrétní update co nejdřív."
      : "I can't handle this right now, I’ll send a concrete update shortly.";
  }

  return text;
}
