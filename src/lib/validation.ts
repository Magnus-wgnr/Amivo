import { toIsoDate } from './dates';

export interface OwnEventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  place: string;
  groupSize: string;
  activity: string;
  cost: string;
  accessibility: string;
}

/** Prüft die Angaben für ein selbst erstelltes Treffen und liefert verständliche Fehlermeldungen. */
export function validateOwnEvent(f: OwnEventForm, today = toIsoDate(new Date())): Partial<Record<keyof OwnEventForm, string>> {
  const errors: Partial<Record<keyof OwnEventForm, string>> = {};
  if (f.title.trim().length < 4) errors.title = 'Bitte gib einen Titel mit mindestens 4 Zeichen ein.';
  if (f.description.trim().length < 20) errors.description = 'Bitte beschreibe das Treffen in ein bis zwei Sätzen (mind. 20 Zeichen).';
  if (!f.date) errors.date = 'Bitte wähle ein Datum.';
  else if (f.date < today) errors.date = 'Das Datum darf nicht in der Vergangenheit liegen.';
  if (!f.time) errors.time = 'Bitte gib eine Uhrzeit an.';
  if (f.place.trim().length < 3) errors.place = 'Bitte gib einen öffentlichen Treffpunkt an.';
  const size = Number(f.groupSize);
  if (!Number.isInteger(size) || size < 2 || size > 30) errors.groupSize = 'Bitte gib eine Gruppengröße zwischen 2 und 30 an.';
  return errors;
}
