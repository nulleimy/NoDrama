export function formatEnglishReply(
  sentences: string[],
  input: { channelId: string; complexity: "compact" | "natural" | "expanded" }
): string {
  const cleaned = sentences.map(cleanSentence).filter(Boolean);

  if (input.channelId === "email" && input.complexity !== "compact") {
    const [opener, ...rest] = cleaned;
    return [opener, "", rest.join(" ")].filter(Boolean).join("\n");
  }

  if (input.channelId === "work_chat" || input.channelId === "professional_dm") {
    return cleaned.join(" ");
  }

  if (input.channelId === "voice_call" || input.channelId === "face_to_face") {
    return cleaned.join(" ");
  }

  return cleaned.join(" ");
}

export function hasCzechLeakage(text: string): boolean {
  return /[áčďéěíňóřšťúůýž]|\b(prosím|děkuji|díky|nechci|potřebuji|můžeš|můžete|rozumím|chápu)\b/i.test(
    text
  );
}

function cleanSentence(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
