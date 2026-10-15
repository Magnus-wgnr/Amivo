import { CalendarHeart, Clock, Euro, HeartHandshake, Info, Phone, PhoneCall, ShieldAlert, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/cards';
import { DemoBadge, Dialog, Note } from '../components/ui';
import { hotlineConfig } from '../config';
import { DEMO_EVENTS } from '../data/demoEvents';
import { withDates } from '../lib/eventFilters';
import { formatPhoneForDisplay, telHref } from '../lib/phone';
import { useStore } from '../state/AppStore';

export default function HotlinePage() {
  const { state } = useStore();
  const [demoDialog, setDemoDialog] = useState(false);
  const phone = hotlineConfig.phoneNumber;
  const next = withDates(DEMO_EVENTS)[0];

  return (
    <div className="page page-hotline">
      <section className="hotline-hero">
        <span className="hotline-icon" aria-hidden>
          <PhoneCall size={44} />
        </span>
        <h1 tabIndex={-1}>Du möchtest reden?</h1>
        <p className="lead">
          Manchmal tut es einfach gut, mit jemandem zu sprechen – über den Tag, über Erinnerungen oder über das, was dich
          gerade beschäftigt. Bei uns hört dir ein Mensch in Ruhe zu.
        </p>

        {phone ? (
          <>
            <a href={telHref(phone)} className="btn btn-call">
              <Phone aria-hidden size={30} />
              Jetzt anrufen
            </a>
            <p className="hotline-number">
              Telefonnummer: <strong>{formatPhoneForDisplay(phone)}</strong>
            </p>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-call" onClick={() => setDemoDialog(true)}>
              <Phone aria-hidden size={30} />
              Jetzt anrufen
            </button>
            <p className="hotline-number">
              <DemoBadge>Demo</DemoBadge> Noch keine Hotline-Nummer hinterlegt – es wird kein Anruf aufgebaut.
            </p>
          </>
        )}
      </section>

      {hotlineConfig.contentIsExample && (
        <Note icon={<Info size={24} />} title="Beispielangaben">
          Die folgenden Zeiten und Angaben zeigen, wie die Hotline später aussehen soll. Sie sind noch nicht verbindlich.
        </Note>
      )}

      <div className="info-grid">
        <section className="card info-card">
          <h2>
            <Clock aria-hidden size={24} /> Erreichbarkeit
          </h2>
          <dl className="hours">
            {hotlineConfig.hours.map((h) => (
              <div key={h.days}>
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="card info-card">
          <h2>
            <Euro aria-hidden size={24} /> Kosten
          </h2>
          <p>{hotlineConfig.costs}</p>
        </section>
        <section className="card info-card">
          <h2>
            <Users aria-hidden size={24} /> Wer ist am Telefon?
          </h2>
          <p>{hotlineConfig.team}</p>
        </section>
        <section className="card info-card">
          <h2>
            <HeartHandshake aria-hidden size={24} /> Dabei unterstützen wir dich
          </h2>
          <ul className="check-list">
            {hotlineConfig.support.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </div>

      <Note icon={<ShieldAlert size={24} />} title="Gut zu wissen" tone="safety">
        <p>
          Die AMIVO-Hotline hört zu und schafft menschlichen Kontakt. Sie ersetzt keine ärztliche oder
          psychotherapeutische Behandlung.
        </p>
        <p>
          <strong>In einem Notfall</strong> wähle bitte den Notruf <a href="tel:112">112</a>. Rund um die Uhr, anonym und
          kostenfrei erreichbar ist die TelefonSeelsorge unter <a href="tel:08001110111">0800 111 0 111</a> oder{' '}
          <a href="tel:08001110222">0800 111 0 222</a>.
        </p>
      </Note>

      <section className="card alt-card">
        <h2>
          <CalendarHeart aria-hidden size={26} /> Lieber persönlich treffen?
        </h2>
        <p>Bei unseren Gemeinschaftstreffen kommst du ganz entspannt mit anderen ins Gespräch.</p>
        {next && (
          <EventCard event={next.event} date={next.date} registered={state.registrations.includes(next.event.id)} compact />
        )}
        <Link to="/treffen" className="btn btn-secondary btn-block">
          Alle Treffen entdecken
        </Link>
      </section>

      <Dialog open={demoDialog} onClose={() => setDemoDialog(false)} title="Das ist eine Demo">
        <p>
          Für diese Demo ist noch <strong>keine echte Telefonnummer</strong> hinterlegt. Deshalb wird kein Anruf
          gestartet und niemand wartet am Telefon.
        </p>
        <p>Sobald die AMIVO-Hotline startet, öffnet diese Schaltfläche direkt die Telefon-Funktion deines Geräts.</p>
        <p>
          Möchtest du jetzt mit jemandem sprechen? Die TelefonSeelsorge ist rund um die Uhr kostenfrei erreichbar:{' '}
          <a href="tel:08001110111">0800 111 0 111</a>.
        </p>
      </Dialog>
    </div>
  );
}
