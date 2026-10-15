import { ArrowRight, CalendarClock, CalendarHeart, Hourglass, Inbox, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventArt } from '../components/EventArt';
import { Avatar, DemoBadge, Dialog, EmptyState, Field, SectionTitle, StatusBadge } from '../components/ui';
import { useToast } from '../components/Toast';
import { activityLabel } from '../data/catalog';
import { DEMO_EVENTS } from '../data/demoEvents';
import { findPerson } from '../data/demoPeople';
import { addDays, formatDateAndTime, formatEventDate, toIsoDate } from '../lib/dates';
import { withDates } from '../lib/eventFilters';
import { useStore } from '../state/AppStore';
import type { MeetingProposal } from '../types';

/** Übersicht: angemeldete Gemeinschaftstreffen, Treffenvorschläge und eigene Treffen */
export function MyMeetings() {
  const { state } = useStore();
  const registered = withDates(DEMO_EVENTS).filter((d) => state.registrations.includes(d.event.id));
  const proposals = state.proposals.filter((p) => !state.blocked.includes(p.personId));
  const nothing = registered.length === 0 && proposals.length === 0 && state.ownEvents.length === 0;

  if (nothing) {
    return (
      <EmptyState
        icon={<CalendarHeart size={40} />}
        title="Noch keine Treffen geplant"
        action={
          <div className="stack-sm">
            <Link to="/treffen" className="btn btn-primary">
              Treffen entdecken
            </Link>
            <Link to="/menschen" className="btn btn-secondary">
              Jemandem ein Treffen vorschlagen
            </Link>
          </div>
        }
      >
        Melde dich für ein Gemeinschaftstreffen an oder schlage jemandem ein Treffen vor.
      </EmptyState>
    );
  }

  return (
    <div className="stack-lg">
      <section>
        <SectionTitle>Gemeinschaftstreffen</SectionTitle>
        {registered.length === 0 ? (
          <p className="muted">Du bist noch für kein Gemeinschaftstreffen angemeldet.</p>
        ) : (
          <ul className="plain-list stack-sm">
            {registered.map(({ event, date }) => (
              <li key={event.id}>
                <Link to={`/treffen/${event.id}`} className="card list-row">
                  <EventArt art={event.art} height={64} />
                  <span className="list-row-text">
                    <strong>{event.title}</strong>
                    <span className="muted">{formatEventDate(date)}</span>
                    <DemoBadge>Demo-Anmeldung</DemoBadge>
                  </span>
                  <ArrowRight aria-hidden size={22} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionTitle>Persönliche Treffen</SectionTitle>
        {proposals.length === 0 ? (
          <p className="muted">Noch keine Treffenvorschläge.</p>
        ) : (
          <ul className="plain-list stack-md">
            {proposals.map((p) => (
              <li key={p.id}>
                <ProposalCard proposal={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {state.ownEvents.length > 0 && (
        <section>
          <SectionTitle>Von dir erstellte Treffen</SectionTitle>
          <ul className="plain-list stack-sm">
            {state.ownEvents.map((e) => (
              <li key={e.id} className="card">
                <h3 className="event-title">{e.title}</h3>
                <p className="muted">
                  {formatDateAndTime(e.date, e.time)} · {e.place}
                </p>
                <span className="badge badge-review">
                  <Hourglass aria-hidden size={16} /> Wird geprüft – noch nicht für andere sichtbar
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ProposalCard({ proposal: p }: { proposal: MeetingProposal }) {
  const { dispatch } = useStore();
  const toast = useToast();
  const person = findPerson(p.personId);
  const [counterOpen, setCounterOpen] = useState(false);
  const [date, setDate] = useState(toIsoDate(addDays(new Date(), 2)));
  const [time, setTime] = useState(p.time);
  const [error, setError] = useState('');
  if (!person) return null;

  const now = () => new Date().toISOString();
  const incomingPending = p.direction === 'incoming' && p.status === 'ausstehend';
  const outgoingPending = p.direction === 'outgoing' && p.status === 'ausstehend';

  const respond = (status: 'angenommen' | 'abgelehnt', by: 'me' | 'them') => {
    dispatch({ type: 'respondProposal', id: p.id, status, at: now(), by });
    if (by === 'me') {
      toast(status === 'angenommen' ? `Schön! Du hast das Treffen mit ${person.firstName} angenommen.` : 'Du hast den Vorschlag freundlich abgelehnt.', status === 'angenommen' ? 'success' : 'info');
    } else {
      toast(`Demo: ${person.firstName} hat ${status === 'angenommen' ? 'angenommen' : 'abgelehnt'}.`, 'info');
    }
  };

  const submitCounter = () => {
    if (!date || date < toIsoDate(new Date())) {
      setError('Bitte wähle ein Datum ab heute.');
      return;
    }
    if (!time) {
      setError('Bitte gib eine Uhrzeit an.');
      return;
    }
    dispatch({ type: 'counterProposal', id: p.id, date, time, at: now() });
    setCounterOpen(false);
    toast(`Dein neuer Terminvorschlag wurde an ${person.firstName} gesendet (Demo).`);
  };

  return (
    <article className="card proposal-card">
      <div className="proposal-head">
        <Avatar name={person.firstName} tone={person.tone} size={56} />
        <div>
          <p className="proposal-direction">
            {p.direction === 'incoming' ? (
              <>
                <Inbox aria-hidden size={18} /> Vorschlag von {person.firstName}
              </>
            ) : (
              <>
                <Send aria-hidden size={18} /> Dein Vorschlag an {person.firstName}
              </>
            )}
          </p>
          <h3 className="event-title">{activityLabel(p.activity)}</h3>
        </div>
      </div>
      <p>
        <CalendarClock aria-hidden size={20} className="inline-icon" /> {formatDateAndTime(p.date, p.time)}
        <br />
        <span className="muted">Treffpunkt: {p.place}</span>
      </p>
      {p.message && <blockquote className="quote">„{p.message}“</blockquote>}
      <StatusBadge status={p.status} />
      {p.history.length > 1 && <p className="muted small">{p.history[p.history.length - 1].text}</p>}

      {incomingPending && (
        <div className="button-stack">
          <button type="button" className="btn btn-mint btn-block" onClick={() => respond('angenommen', 'me')}>
            Annehmen
          </button>
          <button type="button" className="btn btn-secondary btn-block" onClick={() => setCounterOpen(true)}>
            Anderen Termin vorschlagen
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={() => respond('abgelehnt', 'me')}>
            Ablehnen
          </button>
        </div>
      )}

      {outgoingPending && (
        <div className="demo-sim">
          <p className="small">
            <DemoBadge>Demo</DemoBadge> In der Demo antwortet niemand wirklich. Du kannst die Antwort von{' '}
            {person.firstName} hier simulieren:
          </p>
          <div className="button-row">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => respond('angenommen', 'them')}>
              Antwort: angenommen
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => respond('abgelehnt', 'them')}>
              Antwort: abgelehnt
            </button>
          </div>
        </div>
      )}

      {p.status === 'angenommen' && (
        <Link to={`/nachrichten/${person.id}`} className="btn btn-secondary btn-block">
          Nachricht an {person.firstName} schreiben
        </Link>
      )}

      <Dialog
        open={counterOpen}
        onClose={() => setCounterOpen(false)}
        title="Anderen Termin vorschlagen"
        footer={
          <>
            <button type="button" className="btn btn-primary btn-block" onClick={submitCounter}>
              Neuen Termin senden
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => setCounterOpen(false)}>
              Abbrechen
            </button>
          </>
        }
      >
        <Field label="Datum" htmlFor={`counter-date-${p.id}`} error={error}>
          <input
            id={`counter-date-${p.id}`}
            type="date"
            className="input"
            value={date}
            min={toIsoDate(new Date())}
            onChange={(e) => {
              setDate(e.target.value);
              setError('');
            }}
          />
        </Field>
        <Field label="Uhrzeit" htmlFor={`counter-time-${p.id}`}>
          <input
            id={`counter-time-${p.id}`}
            type="time"
            className="input"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setError('');
            }}
          />
        </Field>
      </Dialog>
    </article>
  );
}
