import { CalendarHeart, HandHeart, Phone, Users } from 'lucide-react';
import { useState } from 'react';
import { FontSizePicker } from '../components/FontSizePicker';
import { InterestPicker } from '../components/InterestPicker';
import { DemoNote, Field, Logo, Note } from '../components/ui';
import { HAMBURG_DISTRICTS } from '../data/catalog';
import { useStore } from '../state/AppStore';
import { DEMO_PROFILE, EMPTY_PROFILE } from '../state/initialState';
import type { InterestId } from '../types';

const TOTAL = 5;

/** Ersteinrichtung in wenigen, jederzeit überspringbaren Schritten */
export default function OnboardingPage() {
  const { state, dispatch } = useStore();
  const [step, setStep] = useState(0);
  const [withHelper, setWithHelper] = useState(false);
  // Solange noch das Beispielprofil „Ingrid“ aktiv ist, starten die Felder leer.
  const isPlaceholder = state.profile.firstName === DEMO_PROFILE.firstName && state.profile.bio === DEMO_PROFILE.bio;
  const base = isPlaceholder ? EMPTY_PROFILE : state.profile;
  const [firstName, setFirstName] = useState(base.firstName);
  const [nameError, setNameError] = useState('');
  const [interests, setInterests] = useState<InterestId[]>(base.interests);
  const [district, setDistrict] = useState(base.district);

  const finish = () =>
    dispatch({
      type: 'finishOnboarding',
      withHelper,
      profile: {
        ...(isPlaceholder ? { ...EMPTY_PROFILE, tone: state.profile.tone } : {}),
        firstName: firstName.trim(),
        interests,
        district,
      },
    });

  const skip = () => dispatch({ type: 'skipOnboarding' });

  const next = () => {
    if (step === 1 && firstName.trim().length < 2) {
      setNameError('Bitte gib deinen Vornamen ein, damit wir dich persönlich ansprechen können.');
      document.getElementById('ob-name')?.focus();
      return;
    }
    if (step === TOTAL - 1) finish();
    else setStep((s) => s + 1);
  };

  return (
    <div className="onboarding">
      <div className="onboarding-inner">
        <div className="onboarding-top">
          <Logo />
          <button type="button" className="btn btn-ghost btn-sm" onClick={skip}>
            Später einrichten
          </button>
        </div>
        {step > 0 && (
          <p className="step-label">
            Schritt {step} von {TOTAL - 1}
          </p>
        )}

        <main className="card onboarding-card" aria-live="polite">
          {step === 0 && (
            <div className="welcome">
              <svg viewBox="0 0 200 120" className="welcome-art" aria-hidden="true">
                <circle cx="80" cy="60" r="48" fill="var(--c-mint)" />
                <circle cx="120" cy="60" r="48" fill="var(--c-lavender-light)" fillOpacity=".85" />
                <path d="M88 64 q12 14 24 0" stroke="var(--c-petrol)" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
              <h1 tabIndex={-1}>Willkommen bei AMIVO.</h1>
              <p className="slogan-big">Gemeinsam statt einsam.</p>
              <p>Lerne neue Menschen kennen, erlebe gemeinsam schöne Dinge und finde jemanden zum Reden – ganz einfach.</p>
              <section className="font-shortcut" aria-labelledby="ob-font-title">
                <h2 id="ob-font-title">Ist die Schrift gut lesbar?</h2>
                <p className="muted small">Wähle die Größe, die für dich angenehm ist. Du kannst sie später jederzeit oben über „Schrift“ ändern.</p>
                <FontSizePicker name="font-size-onboarding" />
              </section>
              <label className="option-card helper-option">
                <input type="checkbox" checked={withHelper} onChange={(e) => setWithHelper(e.target.checked)} />
                <span>
                  <strong>Ich helfe einer angehörigen Person bei der Einrichtung</strong>
                  <span className="muted small">
                    Du kannst die ersten Schritte gemeinsam ausfüllen. Du erhältst dadurch keinen Zugriff auf private
                    Nachrichten oder andere persönliche Inhalte.
                  </span>
                </span>
              </label>
              <DemoNote>Dies ist eine Demo. Es wird kein echtes Konto angelegt und nichts an einen Server gesendet.</DemoNote>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 tabIndex={-1}>{withHelper ? 'Wie heißt die Person?' : 'Wie heißt du?'}</h1>
              <p>Wir verwenden nur den Vornamen, um dich freundlich anzusprechen. Der Nachname wird nicht benötigt.</p>
              <Field label="Vorname" htmlFor="ob-name" error={nameError}>
                <input
                  id="ob-name"
                  className="input input-xl"
                  value={firstName}
                  autoComplete="given-name"
                  maxLength={40}
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? 'ob-name-error' : undefined}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setNameError('');
                  }}
                />
              </Field>
              <Note>
                In der echten App folgen hier eine sichere Anmeldung (z. B. per E-Mail oder Telefonnummer) und die
                Zustimmung zu den Nutzungsbedingungen.
              </Note>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 tabIndex={-1}>Was machst du gern?</h1>
              <p>Wähle so viele Interessen, wie du möchtest. So schlagen wir passende Menschen und Treffen vor.</p>
              <InterestPicker value={interests} onChange={setInterests} />
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 tabIndex={-1}>Wo bist du zu Hause?</h1>
              <p>
                Diese Angabe ist freiwillig. Sie hilft uns, Treffen in deiner Nähe zu zeigen. Andere sehen höchstens deinen
                Stadtteil – niemals deine Adresse.
              </p>
              <Field label="Stadtteil in Hamburg" htmlFor="ob-district" optional>
                <select id="ob-district" className="input input-xl" value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="">Lieber nicht angeben</option>
                  {HAMBURG_DISTRICTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 tabIndex={-1}>So funktioniert AMIVO</h1>
              <ul className="how-list">
                <li>
                  <span className="how-icon how-events" aria-hidden>
                    <CalendarHeart size={28} />
                  </span>
                  <span>
                    <strong>Treffen:</strong> Melde dich für Spaziergänge, Kaffeerunden oder Ausflüge an.
                  </span>
                </li>
                <li>
                  <span className="how-icon how-people" aria-hidden>
                    <Users size={28} />
                  </span>
                  <span>
                    <strong>Menschen:</strong> Finde Personen mit ähnlichen Interessen und schlage ein Treffen vor.
                  </span>
                </li>
                <li>
                  <span className="how-icon how-hotline" aria-hidden>
                    <Phone size={28} />
                  </span>
                  <span>
                    <strong>Hotline:</strong> Wenn du reden möchtest, hört dir ein Mensch zu.
                  </span>
                </li>
                <li>
                  <span className="how-icon how-help" aria-hidden>
                    <HandHeart size={28} />
                  </span>
                  <span>
                    <strong>Hilfe:</strong> Oben rechts findest du jederzeit die Schaltfläche „Hilfe“.
                  </span>
                </li>
              </ul>
            </div>
          )}
        </main>

        <div className="button-row button-row-split">
          {step > 0 ? (
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => setStep((s) => s - 1)}>
              Zurück
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="btn btn-primary btn-lg" onClick={next}>
            {step === 0 ? "Los geht's" : step === TOTAL - 1 ? 'Zur Startseite' : 'Weiter'}
          </button>
        </div>
        {(step === 2 || step === 3) && (
          <button type="button" className="btn btn-ghost btn-block" onClick={() => setStep((s) => s + 1)}>
            Diesen Schritt überspringen
          </button>
        )}
      </div>
    </div>
  );
}
