import { ArrowRight, CalendarHeart, CircleHelp, MessageCircleHeart, Phone, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CostBadge, EventCard, PersonCard } from '../components/cards';
import { EventArt } from '../components/EventArt';
import { SectionTitle } from '../components/ui';
import { activityLabel, categoryLabel } from '../data/catalog';
import { DEMO_EVENTS } from '../data/demoEvents';
import { DEMO_PEOPLE, findPerson } from '../data/demoPeople';
import { formatDateAndTime, formatEventDate, greetingFor } from '../lib/dates';
import { withDates } from '../lib/eventFilters';
import { rankPeople } from '../lib/matching';
import { useStore } from '../state/AppStore';

export default function HomePage() {
  const { state } = useStore();
  const { profile } = state;
  const now = new Date();
  const dated = withDates(DEMO_EVENTS, now);
  const myNext = dated.filter((d) => state.registrations.includes(d.event.id));
  const upcoming = dated.filter((d) => !state.registrations.includes(d.event.id)).slice(0, 3);
  const suggestions = rankPeople(
    profile.interests,
    DEMO_PEOPLE.filter((p) => !state.blocked.includes(p.id)),
  ).slice(0, 2);
  const newActivities = dated.filter((d) => d.event.isNew);
  const openInvite = state.proposals.find(
    (p) => p.direction === 'incoming' && p.status === 'ausstehend' && !state.blocked.includes(p.personId),
  );
  const name = profile.firstName.trim();

  return (
    <div className="page page-home">
      <section className="hero">
        <h1 tabIndex={-1} className="hero-title">
          {greetingFor(now)}
          {name ? `, ${name}` : ''}!
          <span className="hero-sub">Schön, dass du da bist.</span>
        </h1>
        <p className="hero-question">Was möchtest du heute machen?</p>
      </section>

      <section aria-label="Die drei Hauptbereiche" className="feature-grid">
        <article className="feature-card feature-hotline">
          <span className="feature-icon" aria-hidden>
            <Phone size={30} />
          </span>
          <h2>Mit jemandem sprechen</h2>
          <p>Du möchtest reden? Hier findest du unsere Hotline.</p>
          <Link to="/hotline" className="btn btn-light btn-block btn-lg">
            Zur Hotline <ArrowRight aria-hidden size={22} />
          </Link>
        </article>
        <article className="feature-card feature-events">
          <span className="feature-icon" aria-hidden>
            <CalendarHeart size={30} />
          </span>
          <h2>Gemeinsam etwas erleben</h2>
          <p>Entdecke Treffen, Aktivitäten und Ausflüge in deiner Nähe.</p>
          <Link to="/treffen" className="btn btn-primary btn-block btn-lg">
            Treffen entdecken <ArrowRight aria-hidden size={22} />
          </Link>
        </article>
        <article className="feature-card feature-people">
          <span className="feature-icon" aria-hidden>
            <Users size={30} />
          </span>
          <h2>Neue Menschen kennenlernen</h2>
          <p>Finde Menschen mit ähnlichen Interessen.</p>
          <Link to="/menschen" className="btn btn-primary btn-block btn-lg">
            Menschen entdecken <ArrowRight aria-hidden size={22} />
          </Link>
        </article>
      </section>

      {openInvite && (
        <section className="card invite-card" aria-labelledby="invite-title">
          <MessageCircleHeart aria-hidden size={30} className="invite-icon" />
          <div>
            <h2 id="invite-title">{findPerson(openInvite.personId)?.firstName} möchte dich treffen</h2>
            <p>
              {activityLabel(openInvite.activity)} · {formatDateAndTime(openInvite.date, openInvite.time, now)}
            </p>
            <Link to="/treffen?ansicht=meine" className="btn btn-secondary">
              Vorschlag ansehen
            </Link>
          </div>
        </section>
      )}

      {myNext.length > 0 && (
        <section>
          <SectionTitle>Deine nächsten Treffen</SectionTitle>
          <ul className="plain-list stack-sm">
            {myNext.map(({ event, date }) => (
              <li key={event.id}>
                <Link to={`/treffen/${event.id}`} className="card list-row">
                  <EventArt art={event.art} height={64} />
                  <span className="list-row-text">
                    <strong>{event.title}</strong>
                    <span className="muted">{formatEventDate(date, now)}</span>
                  </span>
                  <ArrowRight aria-hidden size={22} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <SectionTitle action={<Link to="/treffen" className="text-link">Alle Treffen</Link>}>
          Kommende Veranstaltungen
        </SectionTitle>
        <div className="card-grid">
          {upcoming.map(({ event, date }) => (
            <EventCard key={event.id} event={event} date={date} registered={false} compact />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle action={<Link to="/menschen" className="text-link">Alle Menschen</Link>}>
          Das könnte passen
        </SectionTitle>
        <p className="muted section-intro">Vorschläge auf Grundlage deiner Interessen.</p>
        <div className="card-grid">
          {suggestions.map((p) => (
            <PersonCard key={p.id} person={p} myInterests={profile.interests} />
          ))}
        </div>
      </section>

      {newActivities.length > 0 && (
        <section>
          <SectionTitle>
            <Sparkles aria-hidden size={24} className="inline-icon" /> Neue Aktivitäten
          </SectionTitle>
          <ul className="plain-list stack-sm">
            {newActivities.map(({ event, date }) => (
              <li key={event.id}>
                <Link to={`/treffen/${event.id}`} className="card list-row">
                  <EventArt art={event.art} height={64} />
                  <span className="list-row-text">
                    <strong>{event.title}</strong>
                    <span className="muted">
                      {categoryLabel(event.category)} · {formatEventDate(date, now)}
                    </span>
                    <CostBadge free={event.cost.free} />
                  </span>
                  <ArrowRight aria-hidden size={22} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card help-teaser">
        <CircleHelp aria-hidden size={30} />
        <div>
          <h2>Brauchst du Hilfe mit der App?</h2>
          <p>Hier findest du Antworten auf häufige Fragen und Tipps für sichere Treffen.</p>
          <Link to="/hilfe" className="btn btn-secondary">
            Zur Hilfe
          </Link>
        </div>
      </section>
    </div>
  );
}
