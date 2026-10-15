/**
 * Prüft eine Telefonnummer und gibt sie in einer für `tel:`-Links
 * geeigneten Form zurück (nur Ziffern, optional mit führendem +).
 * Ungültige oder leere Eingaben ergeben `null`.
 */
export function normalizePhoneNumber(input: string | undefined | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!/^[+\d][\d\s/()-]*$/.test(trimmed)) return null;
  const normalized = trimmed.replace(/[\s/()-]/g, '');
  if (!/^\+?\d{6,15}$/.test(normalized)) return null;
  return normalized;
}

export function telHref(normalized: string): string {
  return `tel:${normalized}`;
}

/** Lesbare Darstellung, z. B. +49 40 1234567 → in Dreiergruppen */
export function formatPhoneForDisplay(normalized: string): string {
  const plus = normalized.startsWith('+') ? '+' : '';
  const digits = normalized.replace('+', '');
  return plus + digits.replace(/(\d{3})(?=\d)/g, '$1 ');
}
