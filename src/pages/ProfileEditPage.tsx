import { Camera, Trash2 } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityPicker, InterestPicker } from '../components/InterestPicker';
import { Avatar, Field, PageHeader } from '../components/ui';
import { useToast } from '../components/Toast';
import { HAMBURG_DISTRICTS } from '../data/catalog';
import { resizeImage } from '../lib/image';
import { useStore } from '../state/AppStore';
import type { AgeRange, AvatarTone, UserProfile } from '../types';

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: '', label: 'Keine Angabe' },
  { value: '60-64', label: '60 bis 64 Jahre' },
  { value: '65-69', label: '65 bis 69 Jahre' },
  { value: '70-74', label: '70 bis 74 Jahre' },
  { value: '75-79', label: '75 bis 79 Jahre' },
  { value: '80+', label: '80 Jahre und älter' },
];

const TONES: { value: AvatarTone; label: string }[] = [
  { value: 'mint', label: 'Mintgrün' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'lavender', label: 'Lavendel' },
  { value: 'sand', label: 'Sand' },
];

export default function ProfileEditPage() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [draft, setDraft] = useState<UserProfile>(state.profile);
  const [nameError, setNameError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<UserProfile>) => setDraft((d) => ({ ...d, ...patch }));

  const onPhoto = async (file: File | undefined) => {
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Bitte wähle eine Bilddatei aus (z. B. JPG oder PNG).');
      return;
    }
    try {
      set({ photo: await resizeImage(file, 256) });
    } catch {
      setPhotoError('Das Bild konnte leider nicht geladen werden. Bitte versuche ein anderes.');
    }
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    const name = draft.firstName.trim();
    if (name.length < 2) {
      setNameError('Bitte gib deinen Vornamen ein (mindestens 2 Buchstaben).');
      document.getElementById('pe-name')?.focus();
      return;
    }
    dispatch({ type: 'updateProfile', profile: { ...draft, firstName: name, bio: draft.bio.trim() } });
    toast('Dein Profil wurde gespeichert.');
    navigate('/profil');
  };

  return (
    <div className="page">
      <PageHeader title="Profil bearbeiten" backTo="/profil" backLabel="Zurück zum Profil" />
      <p className="muted">Alle Angaben außer dem Vornamen sind freiwillig. Sie helfen uns, passende Menschen und Treffen vorzuschlagen.</p>
      <form className="form" onSubmit={save} noValidate>
        <section className="card">
          <h2 className="card-heading">Profilbild</h2>
          <div className="photo-row">
            <Avatar name={draft.firstName || '?'} tone={draft.tone} photo={draft.photo} size={96} />
            <div className="button-stack">
              <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
                <Camera aria-hidden size={22} /> Foto auswählen
              </button>
              {draft.photo && (
                <button type="button" className="btn btn-ghost" onClick={() => set({ photo: undefined })}>
                  <Trash2 aria-hidden size={22} /> Foto entfernen
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} />
            </div>
          </div>
          {photoError && <p className="field-error-text" role="alert">{photoError}</p>}
          {!draft.photo && (
            <fieldset className="tone-picker">
              <legend className="field-label">Oder eine Farbe für dein Initialen-Bild</legend>
              <div className="chip-row">
                {TONES.map((t) => (
                  <label key={t.value} className={`tone-option${draft.tone === t.value ? ' selected' : ''}`}>
                    <input type="radio" name="tone" value={t.value} checked={draft.tone === t.value} onChange={() => set({ tone: t.value })} />
                    <span className={`tone-swatch avatar-${t.value}`} aria-hidden />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <p className="small muted">Demo: Das Foto wird verkleinert und nur auf diesem Gerät gespeichert.</p>
        </section>

        <section className="card">
          <h2 className="card-heading">Über dich</h2>
          <Field label="Vorname" htmlFor="pe-name" error={nameError} hint="Wird anderen angezeigt. Dein Nachname bleibt privat.">
            <input
              id="pe-name"
              className="input"
              value={draft.firstName}
              maxLength={40}
              autoComplete="given-name"
              aria-invalid={!!nameError}
              aria-describedby={`pe-name-hint${nameError ? ' pe-name-error' : ''}`}
              onChange={(e) => {
                set({ firstName: e.target.value });
                setNameError('');
              }}
            />
          </Field>
          <Field label="Ungefähres Alter" htmlFor="pe-age" optional>
            <select id="pe-age" className="input" value={draft.ageRange} onChange={(e) => set({ ageRange: e.target.value as AgeRange })}>
              {AGE_RANGES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stadtteil" htmlFor="pe-district" optional hint="Nur der Stadtteil wird gezeigt – niemals deine Adresse.">
            <select id="pe-district" className="input" value={draft.district} onChange={(e) => set({ district: e.target.value })} aria-describedby="pe-district-hint">
              <option value="">Keine Angabe</option>
              {HAMBURG_DISTRICTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Ein paar Worte über dich" htmlFor="pe-bio" optional>
            <textarea id="pe-bio" className="input" rows={4} maxLength={300} value={draft.bio} onChange={(e) => set({ bio: e.target.value })} />
          </Field>
          <p className="small muted" aria-live="polite">{300 - draft.bio.length} Zeichen übrig</p>
        </section>

        <section className="card">
          <h2 className="card-heading">Interessen</h2>
          <InterestPicker value={draft.interests} onChange={(interests) => set({ interests })} />
        </section>

        <section className="card">
          <h2 className="card-heading">Das unternehme ich gern</h2>
          <ActivityPicker value={draft.preferredActivities} onChange={(preferredActivities) => set({ preferredActivities })} />
        </section>

        <div className="sticky-action">
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}
