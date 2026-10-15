import { describe, expect, it } from 'vitest';
import { DEMO_EVENTS } from '../data/demoEvents';
import { DEMO_PEOPLE } from '../data/demoPeople';
import { isUpcomingWeekend, nextOccurrence, toIsoDate } from '../lib/dates';
import { DEFAULT_FILTERS, filterEvents, seatsInfo, withDates } from '../lib/eventFilters';
import { matchSentence, rankPeople } from '../lib/matching';
import { normalizePhoneNumber } from '../lib/phone';
import { createInitialState } from '../state/initialState';
import { reducer, totalUnread } from '../state/reducer';
import { validateOwnEvent } from '../lib/validation';

// Donnerstag, 15. Oktober 2026, 9:00 Uhr
const NOW = new Date(2026, 9, 15, 9, 0);

describe('Termine', () => {
  it('berechnet das nächste Vorkommen eines Wochentags', () => {
    const wed = nextOccurrence({ weekday: 3, time: '10:30' }, NOW);
    expect(toIsoDate(wed)).toBe('2026-10-21');
    const thuToday = nextOccurrence({ weekday: 4, time: '15:00' }, NOW);
    expect(toIsoDate(thuToday)).toBe('2026-10-15');
  });

  it('verschiebt bereits begonnene Termine um eine Woche', () => {
    const late = new Date(2026, 9, 15, 16, 0);
    expect(toIsoDate(nextOccurrence({ weekday: 4, time: '15:00' }, late))).toBe('2026-10-22');
  });

  it('erkennt das kommende Wochenende', () => {
    expect(isUpcomingWeekend(new Date(2026, 9, 17, 11), NOW)).toBe(true);
    expect(isUpcomingWeekend(new Date(2026, 9, 24, 11), NOW)).toBe(false);
  });
});

describe('Filter', () => {
  const dated = withDates(DEMO_EVENTS, NOW);

  it('filtert nach heute, kostenlos und Kategorie', () => {
    expect(filterEvents(dated, { ...DEFAULT_FILTERS, time: 'heute' }, NOW).map((d) => d.event.id)).toEqual(['kaffee-kennenlernen']);
    expect(filterEvents(dated, { ...DEFAULT_FILTERS, freeOnly: true }, NOW).every((d) => d.event.cost.free)).toBe(true);
    expect(filterEvents(dated, { ...DEFAULT_FILTERS, category: 'kultur' }, NOW).map((d) => d.event.id).sort()).toEqual(['mitsingen', 'museumsbesuch']);
  });

  it('zeigt am Wochenende nur Samstag/Sonntag', () => {
    const days = filterEvents(dated, { ...DEFAULT_FILTERS, time: 'wochenende' }, NOW).map((d) => d.date.getDay());
    expect(days.length).toBeGreaterThan(0);
    expect(days.every((d) => d === 0 || d === 6)).toBe(true);
  });

  it('zählt die eigene Anmeldung bei freien Plätzen mit', () => {
    const e = DEMO_EVENTS[0];
    expect(seatsInfo(e, true).free).toBe(seatsInfo(e, false).free - 1);
  });
});

describe('Begegnungen', () => {
  it('erklärt gemeinsame Interessen', () => {
    const anna = DEMO_PEOPLE.find((p) => p.id === 'anna')!;
    expect(matchSentence(['garten', 'spazieren'], anna)).toBe('Ihr interessiert euch beide für Gartenarbeit und Spazierengehen.');
    expect(matchSentence(['schach'], anna)).toBeNull();
  });

  it('sortiert nach Anzahl gemeinsamer Interessen', () => {
    expect(rankPeople(['radfahren', 'schach'], DEMO_PEOPLE)[0].id).toBe('peter');
  });
});

describe('Reducer', () => {
  it('verhindert doppelte Anmeldungen', () => {
    let s = createInitialState(NOW);
    s = reducer(s, { type: 'registerEvent', eventId: 'x' });
    s = reducer(s, { type: 'registerEvent', eventId: 'x' });
    expect(s.registrations).toEqual(['x']);
  });

  it('ändert den Status eines Vorschlags nur, solange er aussteht', () => {
    let s = createInitialState(NOW);
    const id = s.proposals[0].id;
    s = reducer(s, { type: 'respondProposal', id, status: 'angenommen', at: NOW.toISOString(), by: 'me' });
    expect(s.proposals[0].status).toBe('angenommen');
    s = reducer(s, { type: 'respondProposal', id, status: 'abgelehnt', at: NOW.toISOString(), by: 'me' });
    expect(s.proposals[0].status).toBe('angenommen');
  });

  it('macht aus einem Gegenvorschlag einen eigenen, ausstehenden Vorschlag', () => {
    let s = createInitialState(NOW);
    const id = s.proposals[0].id;
    s = reducer(s, { type: 'counterProposal', id, date: '2026-10-20', time: '11:00', at: NOW.toISOString() });
    expect(s.proposals[0]).toMatchObject({ direction: 'outgoing', status: 'ausstehend', date: '2026-10-20', time: '11:00' });
  });

  it('ignoriert leere Nachrichten und blendet Blockierte bei ungelesenen aus', () => {
    let s = createInitialState(NOW);
    const before = s.messages.length;
    s = reducer(s, { type: 'sendMessage', message: { id: 'm', personId: 'anna', from: 'me', text: '   ', sentAt: NOW.toISOString() } });
    expect(s.messages.length).toBe(before);
    const unread = totalUnread(s);
    s = reducer(s, { type: 'block', personId: 'maria' });
    expect(totalUnread(s)).toBeLessThan(unread);
  });
});

describe('Validierung', () => {
  it('akzeptiert nur gültige Telefonnummern', () => {
    expect(normalizePhoneNumber('')).toBeNull();
    expect(normalizePhoneNumber('abc')).toBeNull();
    expect(normalizePhoneNumber('+49 40 / 123 456')).toBe('+4940123456');
  });

  it('prüft eigene Treffen', () => {
    const errors = validateOwnEvent(
      { title: 'Hi', description: 'kurz', date: '2026-10-01', time: '', place: '', groupSize: '1', activity: '', cost: '', accessibility: '' },
      '2026-10-15',
    );
    expect(Object.keys(errors).sort()).toEqual(['date', 'description', 'groupSize', 'place', 'time', 'title']);
  });
});
