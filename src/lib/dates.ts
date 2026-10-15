import type { CommunityEvent } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

function atTime(base: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

export function startOfDay(d: Date): Date {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s;
}

/** Nächstes Vorkommen eines wöchentlichen Beispieltermins (heute zählt, solange er noch nicht begonnen hat). */
export function nextOccurrence(event: Pick<CommunityEvent, 'weekday' | 'time'>, now = new Date()): Date {
  const today = startOfDay(now);
  const diff = (event.weekday - today.getDay() + 7) % 7;
  let candidate = atTime(new Date(today.getTime() + diff * DAY_MS), event.time);
  if (candidate.getTime() < now.getTime()) {
    candidate = atTime(new Date(today.getTime() + (diff + 7) * DAY_MS), event.time);
  }
  return candidate;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Ende der laufenden Woche (Sonntag, 23:59) */
export function endOfWeek(now: Date): Date {
  const d = startOfDay(now);
  const daysUntilSunday = (7 - d.getDay()) % 7;
  const end = new Date(d.getTime() + daysUntilSunday * DAY_MS);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function isThisWeek(date: Date, now: Date): boolean {
  return date.getTime() >= now.getTime() - DAY_MS && date.getTime() <= endOfWeek(now).getTime();
}

/** Kommendes Wochenende (Samstag/Sonntag innerhalb der nächsten 7 Tage) */
export function isUpcomingWeekend(date: Date, now: Date): boolean {
  const day = date.getDay();
  return (day === 6 || day === 0) && date.getTime() - startOfDay(now).getTime() < 8 * DAY_MS;
}

const weekdayLong = new Intl.DateTimeFormat('de-DE', { weekday: 'long' });
const dateLong = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' });
const dateShort = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });

/** z. B. „Heute, 15:00 Uhr“ oder „Mittwoch, 21. Oktober, 10:30 Uhr“ */
export function formatEventDate(date: Date, now = new Date()): string {
  const time = `${timeFmt.format(date)} Uhr`;
  if (isSameDay(date, now)) return `Heute, ${time}`;
  if (isSameDay(date, new Date(now.getTime() + DAY_MS))) return `Morgen, ${time}`;
  return `${weekdayLong.format(date)}, ${dateLong.format(date)}, ${time}`;
}

/** Datum im Format YYYY-MM-DD (lokale Zeit) */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(value: string, time = '00:00'): Date {
  const [y, m, d] = value.split('-').map(Number);
  return atTime(new Date(y, m - 1, d), time);
}

export function addDays(d: Date, days: number): Date {
  return new Date(startOfDay(d).getTime() + days * DAY_MS + 2 * 60 * 60 * 1000);
}

/** Termin eines Vorschlags lesbar, z. B. „Samstag, 17. Oktober, 15:00 Uhr“ */
export function formatDateAndTime(date: string, time: string, now = new Date()): string {
  return formatEventDate(parseIsoDate(date, time), now);
}

/** Verständliche Zeitangabe für Nachrichten */
export function formatMessageTime(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const diffMin = Math.round((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return 'gerade eben';
  if (diffMin < 60) return `vor ${diffMin} ${diffMin === 1 ? 'Minute' : 'Minuten'}`;
  const time = `${timeFmt.format(date)} Uhr`;
  if (isSameDay(date, now)) return `heute, ${time}`;
  if (isSameDay(date, new Date(now.getTime() - DAY_MS))) return `gestern, ${time}`;
  return `${dateShort.format(date)}, ${time}`;
}

export function greetingFor(now = new Date()): string {
  const h = now.getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 18) return 'Guten Tag';
  return 'Guten Abend';
}

/** Absolutes Datum ohne „Heute/Morgen“, z. B. für gespeicherte Nachrichten */
export function formatDateAbsolute(date: string, time: string): string {
  const d = parseIsoDate(date, time);
  return `${weekdayLong.format(d)}, ${dateLong.format(d)}, um ${timeFmt.format(d)} Uhr`;
}
