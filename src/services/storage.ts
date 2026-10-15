import type { AppState } from '../types';
import { STATE_VERSION, createInitialState } from '../state/initialState';

// Lokale Speicherung der Demo-Daten im Browser.
// Für den echten Betrieb durch ein Backend mit Authentifizierung,
// serverseitiger Berechtigungsprüfung und verschlüsselter Übertragung ersetzen.

const KEY = 'amivo-demo-state';

export function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== STATE_VERSION) return createInitialState();
    // Fehlende Felder aus neueren Versionen ergänzen
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Speicher voll oder blockiert (z. B. privater Modus) – die Demo läuft dann ohne Speicherung weiter.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignorieren */
  }
}

export function newId(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}-${rand}`;
}
