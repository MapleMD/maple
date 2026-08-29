// Deterministic slug generator. NFD-normalizes to strip combining marks:
// "café" -> "cafe", "São Paulo" -> "sao-paulo".

export function slugify(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
