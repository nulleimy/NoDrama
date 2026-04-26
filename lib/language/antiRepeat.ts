export function filterRecentlyUsed<T extends { id: string }>(
  candidates: T[],
  recentlyUsedIds: string[]
): T[] {
  const filtered = candidates.filter((candidate) => !recentlyUsedIds.includes(candidate.id));
  return filtered.length > 0 ? filtered : candidates;
}
