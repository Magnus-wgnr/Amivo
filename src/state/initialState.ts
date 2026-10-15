import { addDays, toIsoDate } from '../lib/dates';
import type { AppState, UserProfile } from '../types';

export const STATE_VERSION = 1;

export const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  ageRange: '',
  district: '',
  bio: '',
  interests: [],
  preferredActivities: [],
  tone: 'mint',
  contact: {
    messagesFrom: 'alle',
    allowProposals: true,
    showAge: true,
    showDistrict: true,
  },
};

/** Beispielprofil „Ingrid“, mit dem die Demo startet, wenn die Einrichtung übersprungen wird. */
export const DEMO_PROFILE: UserProfile = {
  ...EMPTY_PROFILE,
  firstName: 'Ingrid',
  ageRange: '70-74',
  district: 'Eppendorf',
  bio: 'Ich bin vor Kurzem nach Eppendorf gezogen und möchte gern neue Leute kennenlernen – am liebsten bei einem Spaziergang oder im Garten.',
  interests: ['garten', 'spazieren', 'kultur', 'musik'],
  preferredActivities: ['kaffee', 'spazieren', 'museum'],
  tone: 'lavender',
};

function minutesAgo(now: Date, minutes: number): string {
  return new Date(now.getTime() - minutes * 60000).toISOString();
}

/** Ausgangszustand der Demo mit einigen Beispielgesprächen und einem eingehenden Treffenvorschlag. */
export function createInitialState(now = new Date()): AppState {
  return {
    version: STATE_VERSION,
    onboarded: false,
    setupWithHelper: false,
    profile: DEMO_PROFILE,
    a11y: { fontScale: 'normal', highContrast: false, reduceMotion: false },
    registrations: [],
    proposals: [
      {
        id: 'demo-proposal-maria',
        personId: 'maria',
        direction: 'incoming',
        activity: 'kaffee',
        date: toIsoDate(addDays(now, 3)),
        time: '15:00',
        place: 'Ein Café in Eimsbüttel',
        message: 'Hallo Ingrid, hättest du Lust auf einen Kaffee? Ich würde dich gern kennenlernen.',
        status: 'ausstehend',
        createdAt: minutesAgo(now, 60 * 20),
        history: [{ at: minutesAgo(now, 60 * 20), text: 'Maria hat ein Treffen vorgeschlagen.' }],
      },
    ],
    messages: [
      {
        id: 'demo-msg-1',
        personId: 'anna',
        from: 'them',
        text: 'Hallo Ingrid! Ich habe gesehen, dass du auch gern im Garten bist. Was pflanzt du gerade?',
        sentAt: minutesAgo(now, 60 * 26),
      },
      {
        id: 'demo-msg-2',
        personId: 'anna',
        from: 'me',
        text: 'Hallo Anna, wie schön! Gerade setze ich Tulpenzwiebeln für das Frühjahr.',
        sentAt: minutesAgo(now, 60 * 25),
      },
      {
        id: 'demo-msg-3',
        personId: 'anna',
        from: 'them',
        text: 'Wunderbar! Vielleicht sehen wir uns ja beim Spaziergang an der Alster?',
        sentAt: minutesAgo(now, 45),
      },
      {
        id: 'demo-msg-4',
        personId: 'maria',
        from: 'them',
        text: 'Hallo Ingrid, ich habe dir gerade einen Treffenvorschlag geschickt. Ich freue mich auf deine Antwort!',
        sentAt: minutesAgo(now, 60 * 20),
        kind: 'proposal',
      },
    ],
    lastRead: { anna: minutesAgo(now, 60 * 25) },
    ownEvents: [],
    blocked: [],
    reports: [],
  };
}
