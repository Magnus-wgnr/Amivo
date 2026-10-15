import { Accessibility, CalendarDays, ChevronRight, Clock, Euro, MapPin, Navigation, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { interestLabel } from '../data/catalog';
import { formatEventDate } from '../lib/dates';
import { seatsInfo } from '../lib/eventFilters';
import { commonInterests } from '../lib/matching';
import type { CommunityEvent, InterestId, Person } from '../types';
import { EventArt } from './EventArt';
import { Avatar } from './ui';

export function CostBadge({ free, label }: { free: boolean; label?: string }) {
  return free ? (
    <span className="badge badge-free">
      <Euro aria-hidden size={16} /> Kostenlos
    </span>
  ) : (
    <span className="badge badge-paid" title={label}>
      <Euro aria-hidden size={16} /> Kostenpflichtig
    </span>
  );
}

export function EventCard({
  event,
  date,
  registered,
  compact = false,
}: {
  event: CommunityEvent;
  date: Date;
  registered: boolean;
  compact?: boolean;
}) {
  const seats = seatsInfo(event, registered);
  return (
    <article className={`card event-card${compact ? ' event-card-compact' : ''}`}>
      <div className="event-card-art">
        <EventArt art={event.art} height={compact ? 110 : 140} />
        <div className="event-card-badges">
          <CostBadge free={event.cost.free} label={event.cost.label} />
          {registered && <span className="badge badge-registered">✓ Du bist dabei</span>}
        </div>
      </div>
      <div className="event-card-body">
        <h3 className="event-title">{event.title}</h3>
        <ul className="meta-list">
          <li>
            <CalendarDays aria-hidden size={22} />
            <span>{formatEventDate(date)}</span>
          </li>
          <li>
            <MapPin aria-hidden size={22} />
            <span>
              {event.meetingPoint}
              {event.distanceKm !== undefined && !compact && (
                <span className="muted"> · ca. {event.distanceKm.toLocaleString('de-DE')} km entfernt</span>
              )}
            </span>
          </li>
          {!compact && (
            <>
              <li>
                <Clock aria-hidden size={22} />
                <span>Dauer: {event.durationLabel}</span>
              </li>
              <li>
                <Euro aria-hidden size={22} />
                <span>Kosten: {event.cost.free ? 'kostenlos' : event.cost.label}</span>
              </li>
              {event.stepFree && (
                <li>
                  <Accessibility aria-hidden size={22} />
                  <span>Stufenlos zugänglich</span>
                </li>
              )}
            </>
          )}
          <li>
            <Users aria-hidden size={22} />
            <span>{seats.full ? 'Ausgebucht – Warteliste in Planung' : `${seats.free} von ${event.capacity} Plätzen frei`}</span>
          </li>
        </ul>
        <Link className="btn btn-primary btn-block" to={`/treffen/${event.id}`} aria-label={`Details ansehen: ${event.title}`}>
          Details ansehen
          <ChevronRight aria-hidden size={22} />
        </Link>
      </div>
    </article>
  );
}

export function InterestTags({ interests, highlight = [] }: { interests: InterestId[]; highlight?: InterestId[] }) {
  return (
    <ul className="tag-list" aria-label="Interessen">
      {interests.map((i) => {
        const shared = highlight.includes(i);
        return (
          <li key={i} className={`tag${shared ? ' tag-shared' : ''}`}>
            {interestLabel(i)}
            {shared && <span className="tag-note"> · gemeinsam</span>}
          </li>
        );
      })}
    </ul>
  );
}

export function PersonCard({ person, myInterests }: { person: Person; myInterests: InterestId[] }) {
  const shared = commonInterests(myInterests, person.interests);
  return (
    <article className="card person-card">
      <div className="person-card-head">
        <Avatar name={person.firstName} tone={person.tone} size={72} />
        <div>
          <h3 className="person-name">
            {person.firstName}
            {person.age !== undefined && <span className="person-age">, {person.age}</span>}
          </h3>
          <p className="muted person-place">
            <Navigation aria-hidden size={18} />
            {person.district}
            {person.distanceKm !== undefined && ` · ca. ${person.distanceKm.toLocaleString('de-DE')} km`}
          </p>
          <span className="badge badge-demo-soft">Beispielprofil</span>
        </div>
      </div>
      <p className="person-intro">„{person.intro}“</p>
      <InterestTags interests={person.interests} highlight={shared} />
      <Link className="btn btn-secondary btn-block" to={`/menschen/${person.id}`} aria-label={`Profil ansehen von ${person.firstName}`}>
        Profil ansehen
        <ChevronRight aria-hidden size={22} />
      </Link>
    </article>
  );
}
