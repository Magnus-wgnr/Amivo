import { Bike, Coffee, Dice5, Footprints, Landmark, ShieldCheck, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, DemoNote, Field, Note, PageHeader } from '../components/ui';
import { useToast } from '../components/Toast';
import { ACTIVITIES, PLACE_SUGGESTIONS, activityLabel } from '../data/catalog';
import { DEMO_PEOPLE, findPerson } from '../data/demoPeople';
import { addDays, formatDateAbsolute, formatDateAndTime, toIsoDate } from '../lib/dates';
import { commonInterests } from '../lib/matching';
import { newId } from '../services/storage';
import { useStore } from '../state/AppStore';
import type { ActivityId } from '../types';

const ACTIVITY_ICONS: Record<ActivityId, LucideIcon> = {
  kaffee: Coffee,
  spazieren: Footprints,
  essen: UtensilsCrossed,
  museum: Landmark,
  brettspiele: Dice5,
  radtour: Bike,
};

const STEPS = ['Person', 'Aktivität', 'Termin', 'Treffpunkt', 'Nachricht', 'Prüfen'] as const;
const TIME_CHIPS = ['10:00', '11:00', '14:00', '15:00', '16:00'];

export default function ProposeMeetingPage() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const preselected = findPerson(id);

  const [step, setStep] = useState(preselected ? 1 : 0);
  const [personId, setPersonId] = useState(preselected?.id ?? '');
  const [activity, setActivity] = useState<ActivityId | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('15:00');
  const [place, setPlace] = useState('');
  const [customPlace, setCustomPlace] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const person = findPerson(personId);
  const today = toIsoDate(new Date());
  const finalPlace = place === 'eigener' ? customPlace.trim() : place;
  const people = DEMO_PEOPLE.filter((p) => !state.blocked.includes(p.id));

  const quickDates = [
    { label: 'Morgen', value: toIsoDate(addDays(new Date(), 1)) },
    { label: 'Übermorgen', value: toIsoDate(addDays(new Date(), 2)) },
    { label: 'In einer Woche', value: toIsoDate(addDays(new Date(), 7)) },
  ];

  const validate = (): string => {
    if (step === 0 && !person) return 'Bitte wähle eine Person aus.';
    if (step === 1 && !activity) return 'Bitte wähle eine Aktivität aus.';
    if (step === 2) {
      if (!date) return 'Bitte wähle ein Datum.';
      if (date < today) return 'Das Datum darf nicht in der Vergangenheit liegen.';
      if (!time) return 'Bitte wähle eine Uhrzeit.';
    }
    if (step === 3 && finalPlace.length < 3) return 'Bitte wähle einen Treffpunkt oder schlage einen eigenen vor.';
    return '';
  };

  const next = () => {
    const err = validate();
    setError(err);
    if (err) return;
    if (step === 3 && !message && person && activity) {
      // Freundlichen Text vorschlagen – kann frei geändert werden
      const verb = ACTIVITIES.find((a) => a.id === activity)?.verb ?? '';
      setMessage(`Hallo ${person.firstName}, hättest du Lust, mit mir ${verb}? Ich würde mich freuen!`);
    }
    setStep((s) => s + 1);
  };

  const back = () => {
    setError('');
    if (step === 0 || (step === 1 && preselected)) navigate(-1);
    else setStep((s) => s - 1);
  };

  const submit = () => {
    if (!person || !activity) return;
    const at = new Date().toISOString();
    dispatch({
      type: 'sendProposal',
      proposal: {
        id: newId('proposal'),
        personId: person.id,
        direction: 'outgoing',
        activity,
        date,
        time,
        place: finalPlace,
        message: message.trim(),
        status: 'ausstehend',
        createdAt: at,
        history: [{ at, text: 'Du hast ein Treffen vorgeschlagen.' }],
      },
      note: {
        id: newId('msg'),
        personId: person.id,
        from: 'me',
        kind: 'proposal',
        sentAt: at,
        text: `Treffenvorschlag: ${activityLabel(activity)} am ${formatDateAbsolute(date, time)}, Treffpunkt: ${finalPlace}.${message.trim() ? `\n\n${message.trim()}` : ''}`,
      },
    });
    toast(`Dein Treffenvorschlag wurde erstellt und an ${person.firstName} gesendet (Demo).`);
    navigate('/treffen?ansicht=meine');
  };

  return (
    <div className="page">
      <PageHeader title="Treffen vorschlagen" backTo="-1" backLabel="Abbrechen" subtitle={person ? `Mit ${person.firstName}` : undefined} />
      <ol className="stepper" aria-label="Fortschritt">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'current' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="visually-hidden">{label}</span>
          </li>
        ))}
      </ol>
      <p className="step-label">
        Schritt {step + 1} von {STEPS.length}: <strong>{STEPS[step]}</strong>
      </p>

      <div className="card step-card">
        {step === 0 && (
          <fieldset className="option-grid">
            <legend className="step-question">Mit wem möchtest du dich treffen?</legend>
            {people.map((p) => (
              <label key={p.id} className={`option-card${personId === p.id ? ' selected' : ''}`}>
                <input type="radio" name="person" value={p.id} checked={personId === p.id} onChange={() => setPersonId(p.id)} />
                <Avatar name={p.firstName} tone={p.tone} size={48} />
                <span>
                  <strong>{p.firstName}</strong>
                  <span className="muted small"> · {commonInterests(state.profile.interests, p.interests).length} gemeinsame Interessen</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="option-grid option-grid-2">
            <legend className="step-question">Was möchtet ihr unternehmen?</legend>
            {ACTIVITIES.map((a) => {
              const Icon = ACTIVITY_ICONS[a.id];
              return (
                <label key={a.id} className={`option-card option-card-vertical${activity === a.id ? ' selected' : ''}`}>
                  <input type="radio" name="activity" value={a.id} checked={activity === a.id} onChange={() => setActivity(a.id)} />
                  <Icon aria-hidden size={32} />
                  <strong>{a.label}</strong>
                </label>
              );
            })}
          </fieldset>
        )}

        {step === 2 && (
          <div>
            <p className="step-question">Wann passt es dir?</p>
            <div className="chip-row" role="group" aria-label="Schnellauswahl Datum">
              {quickDates.map((d) => (
                <button key={d.value} type="button" className="chip" aria-pressed={date === d.value} onClick={() => setDate(d.value)}>
                  {d.label}
                </button>
              ))}
            </div>
            <Field label="Datum" htmlFor="pm-date">
              <input id="pm-date" type="date" className="input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <p className="field-label">Uhrzeit</p>
            <div className="chip-row" role="group" aria-label="Schnellauswahl Uhrzeit">
              {TIME_CHIPS.map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={time === t} onClick={() => setTime(t)}>
                  {t} Uhr
                </button>
              ))}
            </div>
            <Field label="Andere Uhrzeit" htmlFor="pm-time">
              <input id="pm-time" type="time" className="input input-short" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <fieldset className="option-grid">
            <legend className="step-question">Wo möchtet ihr euch treffen?</legend>
            {PLACE_SUGGESTIONS.map((p) => (
              <label key={p} className={`option-card${place === p ? ' selected' : ''}`}>
                <input type="radio" name="place" value={p} checked={place === p} onChange={() => setPlace(p)} />
                <span>{p}</span>
              </label>
            ))}
            <label className={`option-card${place === 'eigener' ? ' selected' : ''}`}>
              <input type="radio" name="place" value="eigener" checked={place === 'eigener'} onChange={() => setPlace('eigener')} />
              <span>Eigenen Treffpunkt vorschlagen</span>
            </label>
            {place === 'eigener' && (
              <Field label="Dein Treffpunkt" htmlFor="pm-place" hint="Bitte einen öffentlichen Ort wählen – keine Wohnadresse.">
                <input id="pm-place" className="input" value={customPlace} onChange={(e) => setCustomPlace(e.target.value)} maxLength={120} aria-describedby="pm-place-hint" />
              </Field>
            )}
            <Note icon={<ShieldCheck size={22} />} tone="safety">
              Für ein erstes Treffen eignen sich öffentliche Orte wie Cafés oder Parks am besten.
            </Note>
          </fieldset>
        )}

        {step === 4 && (
          <Field label="Persönliche Nachricht" htmlFor="pm-message" optional hint="Wir haben dir einen Text vorgeschlagen – du kannst ihn frei ändern.">
            <textarea id="pm-message" className="input" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} aria-describedby="pm-message-hint" />
          </Field>
        )}

        {step === 5 && person && activity && (
          <div>
            <p className="step-question">Passt alles?</p>
            <dl className="summary-list">
              <div>
                <dt>Person</dt>
                <dd>{person.firstName}</dd>
              </div>
              <div>
                <dt>Aktivität</dt>
                <dd>{activityLabel(activity)}</dd>
              </div>
              <div>
                <dt>Termin</dt>
                <dd>{formatDateAndTime(date, time)}</dd>
              </div>
              <div>
                <dt>Treffpunkt</dt>
                <dd>{finalPlace}</dd>
              </div>
              {message.trim() && (
                <div>
                  <dt>Nachricht</dt>
                  <dd>„{message.trim()}“</dd>
                </div>
              )}
            </dl>
            <DemoNote>Der Vorschlag wird nur auf diesem Gerät gespeichert. {person.firstName} ist ein Beispielprofil und erhält ihn nicht wirklich.</DemoNote>
          </div>
        )}

        {error && (
          <p className="field-error-text" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="button-row button-row-split">
        <button type="button" className="btn btn-secondary btn-lg" onClick={back}>
          Zurück
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary btn-lg" onClick={next}>
            Weiter
          </button>
        ) : (
          <button type="button" className="btn btn-mint btn-lg" onClick={submit}>
            Vorschlag senden
          </button>
        )}
      </div>
    </div>
  );
}
