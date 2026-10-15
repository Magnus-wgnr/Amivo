import type {
  A11ySettings,
  AppState,
  ChatMessage,
  MeetingProposal,
  OwnEvent,
  UserProfile,
} from '../types';
import { createInitialState } from './initialState';

// Geschäftslogik der Demo als reine Funktion – unabhängig von der Darstellung testbar.
// In einer produktiven Version würden diese Aktionen an ein Backend gesendet,
// das Berechtigungen serverseitig prüft und Daten sicher speichert.

export type Action =
  | { type: 'finishOnboarding'; profile: Partial<UserProfile>; withHelper: boolean }
  | { type: 'skipOnboarding' }
  | { type: 'restartOnboarding' }
  | { type: 'updateProfile'; profile: Partial<UserProfile> }
  | { type: 'setA11y'; a11y: Partial<A11ySettings> }
  | { type: 'registerEvent'; eventId: string }
  | { type: 'unregisterEvent'; eventId: string }
  | { type: 'sendProposal'; proposal: MeetingProposal; note: ChatMessage }
  | { type: 'respondProposal'; id: string; status: 'angenommen' | 'abgelehnt'; at: string; by: 'me' | 'them' }
  | { type: 'counterProposal'; id: string; date: string; time: string; at: string }
  | { type: 'sendMessage'; message: ChatMessage }
  | { type: 'markRead'; personId: string; at: string }
  | { type: 'createOwnEvent'; event: OwnEvent }
  | { type: 'block'; personId: string }
  | { type: 'unblock'; personId: string }
  | { type: 'report'; personId: string; reason: string; at: string }
  | { type: 'deleteAccount'; now: Date };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'finishOnboarding':
      return {
        ...state,
        onboarded: true,
        setupWithHelper: action.withHelper,
        profile: { ...state.profile, ...action.profile },
      };
    case 'skipOnboarding':
      return { ...state, onboarded: true };
    case 'restartOnboarding':
      return { ...state, onboarded: false };
    case 'updateProfile':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'setA11y':
      return { ...state, a11y: { ...state.a11y, ...action.a11y } };
    case 'registerEvent':
      // Doppelte Anmeldungen verhindern
      if (state.registrations.includes(action.eventId)) return state;
      return { ...state, registrations: [...state.registrations, action.eventId] };
    case 'unregisterEvent':
      return { ...state, registrations: state.registrations.filter((id) => id !== action.eventId) };
    case 'sendProposal':
      return {
        ...state,
        proposals: [action.proposal, ...state.proposals],
        messages: [...state.messages, action.note],
        lastRead: { ...state.lastRead, [action.note.personId]: action.note.sentAt },
      };
    case 'respondProposal':
      return {
        ...state,
        proposals: state.proposals.map((p) => {
          if (p.id !== action.id || p.status !== 'ausstehend') return p;
          const who = action.by === 'me' ? 'Du hast' : 'Die andere Person hat';
          const verb = action.status === 'angenommen' ? 'angenommen' : 'abgelehnt';
          return {
            ...p,
            status: action.status,
            history: [...p.history, { at: action.at, text: `${who} den Vorschlag ${verb}.` }],
          };
        }),
      };
    case 'counterProposal':
      return {
        ...state,
        proposals: state.proposals.map((p) =>
          p.id === action.id && p.status === 'ausstehend'
            ? {
                ...p,
                // Der Gegenvorschlag geht nun von mir aus und wartet auf Antwort.
                direction: 'outgoing',
                date: action.date,
                time: action.time,
                history: [...p.history, { at: action.at, text: 'Du hast einen anderen Termin vorgeschlagen.' }],
              }
            : p,
        ),
      };
    case 'sendMessage': {
      if (!action.message.text.trim()) return state;
      const lastRead =
        action.message.from === 'me'
          ? { ...state.lastRead, [action.message.personId]: action.message.sentAt }
          : state.lastRead;
      return { ...state, messages: [...state.messages, action.message], lastRead };
    }
    case 'markRead':
      return { ...state, lastRead: { ...state.lastRead, [action.personId]: action.at } };
    case 'createOwnEvent':
      return { ...state, ownEvents: [action.event, ...state.ownEvents] };
    case 'block':
      if (state.blocked.includes(action.personId)) return state;
      return { ...state, blocked: [...state.blocked, action.personId] };
    case 'unblock':
      return { ...state, blocked: state.blocked.filter((id) => id !== action.personId) };
    case 'report':
      return {
        ...state,
        reports: [...state.reports, { personId: action.personId, reason: action.reason, at: action.at }],
      };
    case 'deleteAccount':
      return createInitialState(action.now);
    default:
      return state;
  }
}

export function unreadCount(state: AppState, personId: string): number {
  const last = state.lastRead[personId];
  return state.messages.filter(
    (m) => m.personId === personId && m.from === 'them' && (!last || m.sentAt > last),
  ).length;
}

export function totalUnread(state: AppState): number {
  const people = new Set(state.messages.map((m) => m.personId));
  let sum = 0;
  people.forEach((id) => {
    if (!state.blocked.includes(id)) sum += unreadCount(state, id);
  });
  return sum;
}
