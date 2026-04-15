/** Client-side row filter: every whitespace-separated token must appear in the concatenated cell text. */
export function rowMatchesSearch(
  query: string,
  parts: Array<string | number | boolean | null | undefined>,
): boolean {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = parts.map((p) => String(p ?? "").toLowerCase()).join(" ");
  return terms.every((t) => haystack.includes(t));
}
