import { ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoNote, Field, Note, PageHeader } from '../components/ui';
import { useToast } from '../components/Toast';
import { ACTIVITIES } from '../data/catalog';
import { toIsoDate } from '../lib/dates';
import { validateOwnEvent, type OwnEventForm } from '../lib/validation';
import { newId } from '../services/storage';
import { useStore } from '../state/AppStore';


const EMPTY: OwnEventForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  place: '',
  groupSize: '6',
  activity: ACTIVITIES[0].label,
  cost: '',
  accessibility: '',
};

export default function CreateEventPage() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<OwnEventForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof OwnEventForm, string>>>({});

  const update = (key: keyof OwnEventForm) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateOwnEvent(form);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(`ev-${firstError}`)?.focus();
      return;
    }
    dispatch({
      type: 'createOwnEvent',
      event: {
        id: newId('own'),
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time,
        place: form.place.trim(),
        groupSize: Number(form.groupSize),
        activity: form.activity,
        cost: form.cost.trim() || 'Kostenlos',
        accessibility: form.accessibility.trim(),
        status: 'in_pruefung',
        createdAt: new Date().toISOString(),
      },
    });
    toast('Dein Treffen wurde gespeichert und wird vor der Veröffentlichung geprüft.');
    navigate('/treffen?ansicht=meine');
  };

  const describedBy = (k: keyof OwnEventForm, hint = false) =>
    [hint ? `ev-${k}-hint` : '', errors[k] ? `ev-${k}-error` : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className="page">
      <PageHeader title="Eigenes Treffen erstellen" backTo="/treffen" backLabel="Zurück zu den Treffen" />
      <Note icon={<ShieldCheck size={24} />} title="Sicherheit geht vor" tone="safety">
        Neue Treffen werden erst für andere sichtbar, nachdem unser Team sie geprüft hat. Bitte wähle einen öffentlichen
        Treffpunkt und gib keine Wohnadresse an.
      </Note>
      <DemoNote>In der Demo wird dein Treffen nur auf diesem Gerät gespeichert und nicht wirklich geprüft oder veröffentlicht.</DemoNote>

      <form className="form card" onSubmit={submit} noValidate>
        <Field label="Titel" htmlFor="ev-title" error={errors.title}>
          <input id="ev-title" className="input" value={form.title} onChange={update('title')} maxLength={80} aria-invalid={!!errors.title} aria-describedby={describedBy('title')} placeholder="z. B. Spaziergang im Stadtpark" />
        </Field>
        <Field label="Aktivität" htmlFor="ev-activity">
          <select id="ev-activity" className="input" value={form.activity} onChange={update('activity')}>
            {ACTIVITIES.map((a) => (
              <option key={a.id}>{a.label}</option>
            ))}
            <option>Etwas anderes</option>
          </select>
        </Field>
        <Field label="Beschreibung" htmlFor="ev-description" error={errors.description}>
          <textarea id="ev-description" className="input" rows={4} value={form.description} onChange={update('description')} maxLength={600} aria-invalid={!!errors.description} aria-describedby={describedBy('description')} />
        </Field>
        <div className="field-pair">
          <Field label="Datum" htmlFor="ev-date" error={errors.date}>
            <input id="ev-date" type="date" className="input" min={toIsoDate(new Date())} value={form.date} onChange={update('date')} aria-invalid={!!errors.date} aria-describedby={describedBy('date')} />
          </Field>
          <Field label="Uhrzeit" htmlFor="ev-time" error={errors.time}>
            <input id="ev-time" type="time" className="input" value={form.time} onChange={update('time')} aria-invalid={!!errors.time} aria-describedby={describedBy('time')} />
          </Field>
        </div>
        <Field label="Treffpunkt" htmlFor="ev-place" hint="Bitte einen öffentlichen Ort wählen, z. B. ein Café oder einen Parkeingang." error={errors.place}>
          <input id="ev-place" className="input" value={form.place} onChange={update('place')} maxLength={120} aria-invalid={!!errors.place} aria-describedby={describedBy('place', true)} />
        </Field>
        <Field label="Gewünschte Gruppengröße" htmlFor="ev-groupSize" error={errors.groupSize}>
          <input id="ev-groupSize" type="number" inputMode="numeric" min={2} max={30} className="input input-short" value={form.groupSize} onChange={update('groupSize')} aria-invalid={!!errors.groupSize} aria-describedby={describedBy('groupSize')} />
        </Field>
        <Field label="Kosten" htmlFor="ev-cost" optional hint="Leer lassen, wenn das Treffen kostenlos ist.">
          <input id="ev-cost" className="input" value={form.cost} onChange={update('cost')} maxLength={80} aria-describedby="ev-cost-hint" placeholder="z. B. Eintritt 5 €" />
        </Field>
        <Field label="Hinweise zur Zugänglichkeit" htmlFor="ev-accessibility" optional hint="z. B. ebene Wege, Sitzgelegenheiten, Aufzug vorhanden">
          <textarea id="ev-accessibility" className="input" rows={2} value={form.accessibility} onChange={update('accessibility')} maxLength={300} aria-describedby="ev-accessibility-hint" />
        </Field>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Zur Prüfung einreichen
        </button>
      </form>
    </div>
  );
}
