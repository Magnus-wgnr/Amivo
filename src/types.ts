// Zentrale Datentypen der AMIVO-App.
// Sie beschreiben die Struktur, die später auch ein echtes Backend liefern soll.

export type InterestId =
  | 'natur'
  | 'spazieren'
  | 'kultur'
  | 'kochen'
  | 'brettspiele'
  | 'musik'
  | 'radfahren'
  | 'reisen'
  | 'handarbeit'
  | 'garten'
  | 'sport'
  | 'geschichte'
  | 'fotografie'
  | 'schach'
  | 'ausfluege';

export type ActivityId = 'kaffee' | 'spazieren' | 'essen' | 'museum' | 'brettspiele' | 'radtour';

export type EventCategory = 'kultur' | 'natur' | 'geselligkeit' | 'ausflug';

export type EventArtKey = 'alster' | 'kaffee' | 'spiele' | 'museum' | 'gruen' | 'chor' | 'rad';

export interface CommunityEvent {
  id: string;
  title: string;
  category: EventCategory;
  art: EventArtKey;
  /** Wochentag 0 = Sonntag … 6 = Samstag. Termine sind wiederkehrende Beispieltermine. */
  weekday: number;
  /** Uhrzeit im Format HH:MM */
  time: string;
  meetingPoint: string;
  district: string;
  distanceKm?: number;
  durationLabel: string;
  durationMinutes: number;
  cost: { free: boolean; label: string };
  capacity: number;
  registeredCount: number;
  shortDescription: string;
  description: string;
  accessibility: string[];
  stepFree: boolean;
  activityLevel: 'leicht' | 'mittel' | 'aktiv';
  organizer: { name: string; role: string };
  arrival: string;
  isNew?: boolean;
}

export interface Person {
  id: string;
  firstName: string;
  age?: number;
  district?: string;
  distanceKm?: number;
  interests: InterestId[];
  intro: string;
  about: string;
  /** Farbe des neutralen Platzhalter-Avatars */
  tone: AvatarTone;
}

export type AvatarTone = 'petrol' | 'mint' | 'lavender' | 'sand';

export type ProposalStatus = 'ausstehend' | 'angenommen' | 'abgelehnt';

export interface ProposalHistoryEntry {
  at: string;
  text: string;
}

export interface MeetingProposal {
  id: string;
  personId: string;
  /** outgoing = ich habe vorgeschlagen, incoming = die andere Person hat vorgeschlagen */
  direction: 'outgoing' | 'incoming';
  activity: ActivityId;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  place: string;
  message: string;
  status: ProposalStatus;
  createdAt: string;
  history: ProposalHistoryEntry[];
}

export interface ChatMessage {
  id: string;
  personId: string;
  from: 'me' | 'them';
  text: string;
  sentAt: string;
  /** Automatisch erzeugte Antwort in der Demo */
  demoAuto?: boolean;
  kind?: 'text' | 'proposal';
}

export interface OwnEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  place: string;
  groupSize: number;
  activity: string;
  cost: string;
  accessibility: string;
  status: 'in_pruefung';
  createdAt: string;
}

export type AgeRange = '' | '60-64' | '65-69' | '70-74' | '75-79' | '80+';

export interface ContactSettings {
  /** Wer darf mir schreiben? */
  messagesFrom: 'alle' | 'gemeinsame-interessen' | 'niemand';
  allowProposals: boolean;
  showAge: boolean;
  showDistrict: boolean;
}

export interface UserProfile {
  firstName: string;
  ageRange: AgeRange;
  district: string;
  bio: string;
  interests: InterestId[];
  preferredActivities: ActivityId[];
  tone: AvatarTone;
  /** Verkleinertes Profilbild als Data-URL (nur lokal gespeichert) */
  photo?: string;
  contact: ContactSettings;
}

export type FontScale = 'normal' | 'gross' | 'sehr-gross' | 'extra-gross';

export interface A11ySettings {
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface Report {
  personId: string;
  reason: string;
  at: string;
}

export interface AppState {
  version: number;
  onboarded: boolean;
  /** Einrichtung wurde mit Unterstützung von Angehörigen durchgeführt */
  setupWithHelper: boolean;
  profile: UserProfile;
  a11y: A11ySettings;
  registrations: string[];
  proposals: MeetingProposal[];
  messages: ChatMessage[];
  lastRead: Record<string, string>;
  ownEvents: OwnEvent[];
  blocked: string[];
  reports: Report[];
}
