import { CheckCircle2, FlaskConical, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Note, PageHeader } from '../components/ui';
import { hotlineConfig } from '../config';

const FAQ = [
  {
    q: 'Wie melde ich mich für ein Treffen an?',
    a: 'Tippe unten auf „Treffen“, wähle ein Treffen aus und tippe auf „Details ansehen“. Dort findest du die große Schaltfläche „Ich bin dabei“.',
  },
  {
    q: 'Wie lerne ich neue Menschen kennen?',
    a: 'Unter „Menschen“ siehst du Personen mit ähnlichen Interessen. Öffne ein Profil und tippe auf „Nachricht schreiben“ oder „Treffen vorschlagen“.',
  },
  {
    q: 'Kostet AMIVO etwas?',
    a: 'Bei jedem Treffen steht deutlich dabei, ob es kostenlos ist oder was es kostet. Es gibt keine versteckten Kosten.',
  },
  {
    q: 'Wie kann ich die Schrift größer machen?',
    a: 'Gehe zu „Profil“ → „Barrierefreiheit“ und wähle „Groß“ oder „Sehr groß“.',
  },
  {
    q: 'Was mache ich, wenn sich jemand unangemessen verhält?',
    a: 'Öffne das Profil der Person und tippe unten auf „Melden“ oder „Blockieren“. Blockierte Personen können dir nicht mehr schreiben.',
  },
  {
    q: 'Kann mir jemand aus meiner Familie bei der Einrichtung helfen?',
    a: 'Ja. Bei der Einrichtung gibt es dafür eine eigene Option. Angehörige erhalten dabei keinen Zugriff auf deine Nachrichten.',
  },
];

export function HelpPage() {
  return (
    <div className="page">
      <PageHeader title="Hilfe und Support" backTo="-1" />
      <section className="card">
        <h2 className="card-heading">Häufige Fragen</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Note icon={<ShieldCheck size={24} />} title="Tipps für sichere Treffen" tone="safety">
        <ul className="check-list">
          <li>Triff dich beim ersten Mal an einem öffentlichen Ort, z. B. in einem Café.</li>
          <li>Erzähle einer vertrauten Person, wann und wo du dich triffst.</li>
          <li>Gib Adresse, Telefonnummer oder Bankdaten nicht vorschnell weiter.</li>
          <li>Leihe niemandem Geld, den du gerade erst kennengelernt hast.</li>
        </ul>
      </Note>

      <section className="card">
        <h2 className="card-heading">Persönliche Hilfe</h2>
        <p>
          Du möchtest lieber mit einem Menschen sprechen? Auf der Hotline-Seite findest du alle Informationen.
          {!hotlineConfig.phoneNumber && ' (In dieser Demo ist noch keine Rufnummer hinterlegt.)'}
        </p>
        <Link to="/hotline" className="btn btn-primary btn-block">
          <Phone aria-hidden size={22} /> Zur Hotline
        </Link>
        <p className="small muted">Ein Support-Kontakt per E-Mail wird mit dem Start der echten App ergänzt.</p>
      </section>

      <Link to="/demo" className="btn btn-secondary btn-block">
        <FlaskConical aria-hidden size={22} /> Was ist in dieser Demo echt?
      </Link>
    </div>
  );
}

const REAL = [
  'Navigation und alle Bildschirme der App',
  'Filtern von Treffen, Auswahl von Interessen, Bearbeiten des Profils',
  'Einstellungen zur Barrierefreiheit (Schriftgröße, Kontrast, Bewegung)',
  'Speicherung deiner Angaben – ausschließlich auf diesem Gerät',
  'Hinweise zur TelefonSeelsorge und zum Notruf 112 (echte Rufnummern)',
];

const DEMO = [
  'Alle Veranstaltungen sind Beispieltermine und nicht buchbar.',
  'Alle Personenprofile sind frei erfunden – es gibt noch keine echten Mitglieder.',
  'Nachrichten und Treffenvorschläge erreichen niemanden. Antworten werden automatisch simuliert und gekennzeichnet.',
  'Anmeldungen zu Treffen sind Demo-Anmeldungen und nicht verbindlich.',
  'Meldungen und eigene Treffen werden nicht von einem Team geprüft.',
  'Die AMIVO-Hotline hat noch keine Rufnummer – es wird kein Anruf aufgebaut.',
];

export function DemoInfoPage() {
  return (
    <div className="page">
      <PageHeader title="Über diese Demo" backTo="-1" subtitle="Wir sind ehrlich: Hier siehst du, was bereits funktioniert und was nur gezeigt wird." />
      <section className="card">
        <h2 className="card-heading">
          <CheckCircle2 aria-hidden size={24} /> Funktioniert bereits
        </h2>
        <ul className="check-list">
          {REAL.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2 className="card-heading">
          <FlaskConical aria-hidden size={24} /> Nur Demonstration
        </h2>
        <ul className="dash-list">
          {DEMO.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <Note title="Für die echte App">
        Für den Betrieb sind ein sicheres Backend mit Benutzerkonten, serverseitigen Berechtigungsprüfungen, verschlüsselter
        Speicherung von Nachrichten, Moderation und eine vollständige Datenschutzprüfung vorgesehen.
      </Note>
    </div>
  );
}
