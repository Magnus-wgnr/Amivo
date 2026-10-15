import {
  Accessibility,
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  Euro,
  MapPin,
  TrainFront,
  UserRound,
  Users,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CostBadge } from '../components/cards';
import { EventArt } from '../components/EventArt';
import { DemoBadge, Dialog, EmptyState, Note, PageHeader } from '../components/ui';
import { useToast } from '../components/Toast';
import { ACTIVITY_LEVEL_LABEL, categoryLabel } from '../data/catalog';
import { DEMO_EVENTS } from '../data/demoEvents';
import { formatEventDate, nextOccurrence } from '../lib/dates';
import { seatsInfo } from '../lib/eventFilters';
import { useStore } from '../state/AppStore';

export default function EventDetailPage() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const event = DEMO_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="page">
        <PageHeader title="Treffen nicht gefunden" backTo="/treffen" backLabel="Zurück zu den Treffen" />
        <EmptyState icon={<CalendarDays size={40} />} title="Dieses Treffen gibt es leider nicht (mehr).">
          <Link to="/treffen">Alle Treffen ansehen</Link>
        </EmptyState>
      </div>
    );
  }

  const registered = state.registrations.includes(event.id);
  const seats = seatsInfo(event, registered);
  const date = nextOccurrence(event);

  const register = () => {
    if (registered) return; // doppelte Anmeldung verhindern
    dispatch({ type: 'registerEvent', eventId: event.id });
    toast('Du bist für dieses Treffen vorgemerkt (Demo-Anmeldung).');
  };

  const unregister = () => {
    dispatch({ type: 'unregisterEvent', eventId: event.id });
    setConfirmLeave(false);
    toast('Du hast dich von diesem Treffen abgemeldet.', 'info');
  };

  return (
    <div className="page page-detail">
      <PageHeader title={event.title} backTo="-1" backLabel="Zurück" />
      <div className="detail-art">
        <EventArt art={event.art} height={180} />
      </div>
      <div className="badge-row">
        <span className="badge badge-category">{categoryLabel(event.category)}</span>
        <CostBadge free={event.cost.free} />
        <DemoBadge>Beispieltermin</DemoBadge>
      </div>

      <p className="lead">{event.description}</p>

      <section className="card">
        <h2 className="visually-hidden">Das Wichtigste auf einen Blick</h2>
        <dl className="detail-list">
          <DetailRow icon={<CalendarDays />} label="Datum und Uhrzeit" value={formatEventDate(date)} />
          <DetailRow icon={<Clock />} label="Dauer" value={event.durationLabel} />
          <DetailRow
            icon={<MapPin />}
            label="Treffpunkt"
            value={
              <>
                {event.meetingPoint}
                <br />
                <span className="muted">
                  {event.district}
                  {event.distanceKm !== undefined && ` · ca. ${event.distanceKm.toLocaleString('de-DE')} km entfernt`}
                </span>
              </>
            }
          />
          <DetailRow icon={<Euro />} label="Kosten" value={event.cost.free ? 'Kostenlos' : event.cost.label} />
          <DetailRow
            icon={<Users />}
            label="Teilnehmende"
            value={
              seats.full
                ? `Ausgebucht (${event.capacity} Plätze)`
                : `${seats.taken} von ${event.capacity} Plätzen belegt – noch ${seats.free} frei`
            }
          />
          <DetailRow icon={<Activity />} label="Aktivitätsniveau" value={ACTIVITY_LEVEL_LABEL[event.activityLevel]} />
          <DetailRow
            icon={<UserRound />}
            label="Ansprechperson"
            value={`${event.organizer.name} – ${event.organizer.role}`}
          />
        </dl>
      </section>

      <section className="card">
        <h2 className="card-heading">
          <Accessibility aria-hidden size={24} /> Hinweise zur Barrierefreiheit
        </h2>
        <ul className="check-list">
          {event.accessibility.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="card-heading">
          <TrainFront aria-hidden size={24} /> Anreise
        </h2>
        <p>{event.arrival}</p>
      </section>

      <div className="sticky-action">
        {registered ? (
          <div className="registered-box" role="status">
            <p className="registered-text">
              <CheckCircle2 aria-hidden size={28} />
              <span>
                <strong>Du bist dabei!</strong> Du bist für dieses Treffen vorgemerkt.
                <br />
                <span className="muted">Demo-Anmeldung – nur auf diesem Gerät gespeichert, nicht verbindlich.</span>
              </span>
            </p>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmLeave(true)}>
              Abmelden
            </button>
          </div>
        ) : seats.full ? (
          <button type="button" className="btn btn-primary btn-block btn-lg" disabled>
            Leider ausgebucht
          </button>
        ) : (
          <button type="button" className="btn btn-mint btn-block btn-lg" onClick={register}>
            Ich bin dabei
          </button>
        )}
      </div>

      <Note title="Tipp">
        Du kannst eine vertraute Person mitbringen. Sag einfach der Ansprechperson Bescheid.
      </Note>

      <Dialog
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        title="Vom Treffen abmelden?"
        footer={
          <>
            <button type="button" className="btn btn-primary btn-block" onClick={unregister}>
              Ja, abmelden
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => setConfirmLeave(false)}>
              Nein, ich bleibe dabei
            </button>
          </>
        }
      >
        <p>Dein Platz wird dann für andere frei. Du kannst dich später jederzeit wieder anmelden.</p>
      </Dialog>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-icon" aria-hidden>
        {icon}
      </span>
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}
