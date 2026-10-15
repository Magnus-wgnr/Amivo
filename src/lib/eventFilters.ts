import type { CommunityEvent, EventCategory } from '../types';
import { isSameDay, isThisWeek, isUpcomingWeekend, nextOccurrence } from './dates';

export type TimeFilter = 'alle' | 'heute' | 'woche' | 'wochenende';

export interface EventFilters {
  time: TimeFilter;
  category: EventCategory | 'alle';
  freeOnly: boolean;
  stepFreeOnly: boolean;
  easyOnly: boolean;
}

export const DEFAULT_FILTERS: EventFilters = {
  time: 'alle',
  category: 'alle',
  freeOnly: false,
  stepFreeOnly: false,
  easyOnly: false,
};

export function isDefaultFilters(f: EventFilters): boolean {
  return (Object.keys(DEFAULT_FILTERS) as (keyof EventFilters)[]).every((k) => f[k] === DEFAULT_FILTERS[k]);
}

export interface DatedEvent {
  event: CommunityEvent;
  date: Date;
}

/** Ordnet jedem Beispieltermin sein nächstes Datum zu und sortiert chronologisch. */
export function withDates(events: CommunityEvent[], now = new Date()): DatedEvent[] {
  return events
    .map((event) => ({ event, date: nextOccurrence(event, now) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function filterEvents(items: DatedEvent[], f: EventFilters, now = new Date()): DatedEvent[] {
  return items.filter(({ event, date }) => {
    if (f.time === 'heute' && !isSameDay(date, now)) return false;
    if (f.time === 'woche' && !isThisWeek(date, now)) return false;
    if (f.time === 'wochenende' && !isUpcomingWeekend(date, now)) return false;
    if (f.category !== 'alle' && event.category !== f.category) return false;
    if (f.freeOnly && !event.cost.free) return false;
    if (f.stepFreeOnly && !event.stepFree) return false;
    if (f.easyOnly && event.activityLevel !== 'leicht') return false;
    return true;
  });
}

export function seatsInfo(event: CommunityEvent, registeredByMe: boolean) {
  const taken = Math.min(event.capacity, event.registeredCount + (registeredByMe ? 1 : 0));
  const free = Math.max(0, event.capacity - taken);
  return { taken, free, full: free === 0 };
}
