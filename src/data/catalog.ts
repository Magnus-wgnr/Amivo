import type { ActivityId, EventCategory, InterestId } from '../types';

// Stammdaten: Interessen, Aktivitäten und Kategorien mit verständlichen Beschriftungen.

export const INTERESTS: { id: InterestId; label: string }[] = [
  { id: 'natur', label: 'Natur' },
  { id: 'spazieren', label: 'Spazierengehen' },
  { id: 'kultur', label: 'Kultur' },
  { id: 'kochen', label: 'Kochen' },
  { id: 'brettspiele', label: 'Brettspiele' },
  { id: 'musik', label: 'Musik' },
  { id: 'radfahren', label: 'Radfahren' },
  { id: 'reisen', label: 'Reisen' },
  { id: 'handarbeit', label: 'Handarbeit' },
  { id: 'garten', label: 'Gartenarbeit' },
  { id: 'sport', label: 'Sport' },
  { id: 'geschichte', label: 'Geschichte' },
  { id: 'fotografie', label: 'Fotografie' },
  { id: 'schach', label: 'Schach' },
  { id: 'ausfluege', label: 'Ausflüge' },
];

export const interestLabel = (id: InterestId): string =>
  INTERESTS.find((i) => i.id === id)?.label ?? id;

export const ACTIVITIES: { id: ActivityId; label: string; verb: string }[] = [
  { id: 'kaffee', label: 'Kaffee trinken', verb: 'einen Kaffee trinken' },
  { id: 'spazieren', label: 'Spazierengehen', verb: 'spazieren gehen' },
  { id: 'essen', label: 'Gemeinsam essen', verb: 'gemeinsam essen' },
  { id: 'museum', label: 'Ein Museum besuchen', verb: 'ein Museum besuchen' },
  { id: 'brettspiele', label: 'Brettspiele spielen', verb: 'Brettspiele spielen' },
  { id: 'radtour', label: 'Kleine Radtour', verb: 'eine kleine Radtour machen' },
];

export const activityLabel = (id: ActivityId): string =>
  ACTIVITIES.find((a) => a.id === id)?.label ?? id;

export const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'kultur', label: 'Kultur' },
  { id: 'natur', label: 'Natur und Bewegung' },
  { id: 'geselligkeit', label: 'Spiele und Geselligkeit' },
  { id: 'ausflug', label: 'Ausflüge' },
];

export const categoryLabel = (id: EventCategory): string =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const ACTIVITY_LEVEL_LABEL = {
  leicht: 'Leicht – gemütliches Tempo',
  mittel: 'Mittel – etwas Bewegung',
  aktiv: 'Aktiv – längere Strecken',
} as const;

/** Vorschläge für öffentliche Treffpunkte bei individuellen Treffen */
export const PLACE_SUGGESTIONS = [
  'Ein Café in meinem Stadtteil',
  'Alster – Treffpunkt Kennedybrücke',
  'Stadtpark – am Planetarium',
  'Planten un Blomen – Haupteingang',
  'Ein Museum in der Innenstadt',
];

export const HAMBURG_DISTRICTS = [
  'Altona',
  'Barmbek',
  'Bergedorf',
  'Blankenese',
  'Eimsbüttel',
  'Eppendorf',
  'Harburg',
  'Hamm',
  'Ottensen',
  'Rahlstedt',
  'St. Georg',
  'Uhlenhorst',
  'Wandsbek',
  'Winterhude',
];
