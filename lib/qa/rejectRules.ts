export function isHardReject(text: string): string | null {
  const banned = ["umřel", "zemřel", "nehoda", "my grandma died", "I was in an accident"];

  for (const phrase of banned) {
    if (text.toLowerCase().includes(phrase)) {
      return "fake_or_unethical_excuse";
    }
  }

  return null;
}
