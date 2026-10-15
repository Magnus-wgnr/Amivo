import { Ban, CalendarPlus, Flag, Heart, MessageCircle, Navigation, ShieldCheck, UserX } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InterestTags } from '../components/cards';
import { Avatar, DemoBadge, Dialog, EmptyState, Note, PageHeader } from '../components/ui';
import { useToast } from '../components/Toast';
import { findPerson } from '../data/demoPeople';
import { commonInterests, matchSentence } from '../lib/matching';
import { useStore } from '../state/AppStore';

const REPORT_REASONS = [
  'Unangemessene oder beleidigende Nachrichten',
  'Verdacht auf ein gefälschtes Profil',
  'Fragt nach Geld oder Bankdaten',
  'Fühlt sich unangenehm oder bedrängend an',
  'Etwas anderes',
];

export default function PersonDetailPage() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<'none' | 'report' | 'block'>('none');
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const person = findPerson(id);

  if (!person || state.blocked.includes(person.id)) {
    return (
      <div className="page">
        <PageHeader title="Profil nicht verfügbar" backTo="/menschen" backLabel="Zurück zu Menschen" />
        <EmptyState icon={<UserX size={40} />} title="Dieses Profil kann nicht angezeigt werden.">
          Möglicherweise hast du die Person blockiert. Blockierungen kannst du unter Profil → Datenschutz aufheben.
        </EmptyState>
      </div>
    );
  }

  const shared = commonInterests(state.profile.interests, person.interests);
  const sentence = matchSentence(state.profile.interests, person);

  const sendReport = () => {
    dispatch({ type: 'report', personId: person.id, reason, at: new Date().toISOString() });
    setDialog('none');
    toast('Danke! Deine Meldung wurde gespeichert (Demo – sie wird nicht an ein Team gesendet).', 'info');
  };

  const block = () => {
    dispatch({ type: 'block', personId: person.id });
    setDialog('none');
    toast(`${person.firstName} wurde blockiert und sieht dich nicht mehr.`, 'info');
    navigate('/menschen');
  };

  return (
    <div className="page">
      <PageHeader title={`Profil von ${person.firstName}`} backTo="-1" />
      <section className="card profile-hero">
        <Avatar name={person.firstName} tone={person.tone} size={112} />
        <div>
          <h2 className="profile-name">
            {person.firstName}
            {person.age !== undefined && <span>, {person.age}</span>}
          </h2>
          <p className="muted person-place">
            <Navigation aria-hidden size={18} /> {person.district}
            {person.distanceKm !== undefined && ` · ca. ${person.distanceKm.toLocaleString('de-DE')} km entfernt`}
          </p>
          <DemoBadge>Fiktives Beispielprofil</DemoBadge>
        </div>
      </section>

      {sentence && (
        <div className="match-box">
          <Heart aria-hidden size={26} />
          <p>
            <strong>Das habt ihr gemeinsam:</strong> {sentence}
          </p>
        </div>
      )}

      <section className="card">
        <h2 className="card-heading">Über {person.firstName}</h2>
        <p className="person-intro">„{person.intro}“</p>
        <p>{person.about}</p>
      </section>

      <section className="card">
        <h2 className="card-heading">Interessen</h2>
        <InterestTags interests={person.interests} highlight={shared} />
      </section>

      <div className="button-stack">
        <Link to={`/nachrichten/${person.id}`} className="btn btn-primary btn-block btn-lg">
          <MessageCircle aria-hidden size={24} /> Nachricht schreiben
        </Link>
        <Link to={`/menschen/${person.id}/treffen-vorschlagen`} className="btn btn-mint btn-block btn-lg">
          <CalendarPlus aria-hidden size={24} /> Treffen vorschlagen
        </Link>
      </div>

      <Note icon={<ShieldCheck size={24} />} title="Sicher kennenlernen" tone="safety">
        Triff dich beim ersten Mal am besten an einem öffentlichen Ort, zum Beispiel in einem Café. Gib persönliche
        Daten wie deine Adresse oder Bankverbindung nicht vorschnell weiter. AMIVO zeigt niemals genaue Wohnadressen an.
      </Note>

      <div className="safety-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setDialog('report')}>
          <Flag aria-hidden size={22} /> {person.firstName} melden
        </button>
        <button type="button" className="btn btn-ghost btn-danger-text" onClick={() => setDialog('block')}>
          <Ban aria-hidden size={22} /> {person.firstName} blockieren
        </button>
      </div>

      <Dialog
        open={dialog === 'report'}
        onClose={() => setDialog('none')}
        title={`${person.firstName} melden`}
        footer={
          <>
            <button type="button" className="btn btn-primary btn-block" onClick={sendReport}>
              Meldung absenden
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => setDialog('none')}>
              Abbrechen
            </button>
          </>
        }
      >
        <p>Was ist passiert? Deine Meldung bleibt vertraulich.</p>
        <fieldset className="radio-group">
          <legend className="visually-hidden">Grund der Meldung</legend>
          {REPORT_REASONS.map((r) => (
            <label key={r} className="radio">
              <input type="radio" name="report-reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
              <span>{r}</span>
            </label>
          ))}
        </fieldset>
        <p className="small muted">Demo: Die Meldung wird nur lokal gespeichert. Im echten Betrieb prüft ein Team jede Meldung.</p>
      </Dialog>

      <Dialog
        open={dialog === 'block'}
        onClose={() => setDialog('none')}
        title={`${person.firstName} blockieren?`}
        footer={
          <>
            <button type="button" className="btn btn-danger btn-block" onClick={block}>
              Ja, blockieren
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => setDialog('none')}>
              Abbrechen
            </button>
          </>
        }
      >
        <p>
          {person.firstName} kann dir dann keine Nachrichten oder Treffenvorschläge mehr senden und wird dir nicht mehr
          angezeigt. Du kannst die Blockierung jederzeit unter Profil → Datenschutz aufheben.
        </p>
      </Dialog>
    </div>
  );
}
