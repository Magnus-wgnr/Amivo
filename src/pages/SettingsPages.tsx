import { Database, Lock, ShieldCheck, Trash2, UserCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FontSizePicker } from '../components/FontSizePicker';
import { Avatar, DemoNote, PageHeader } from '../components/ui';
import { useToast } from '../components/Toast';
import { findPerson } from '../data/demoPeople';
import { useStore } from '../state/AppStore';
import type { ContactSettings } from '../types';

function Switch({ id, label, hint, checked, onChange }: { id: string; label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="switch-row">
      <label htmlFor={id} className="switch-label">
        <strong>{label}</strong>
        {hint && <span className="muted small">{hint}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className="switch"
        onClick={() => onChange(!checked)}
      >
        <span className="switch-thumb" aria-hidden />
        <span className="switch-text">{checked ? 'An' : 'Aus'}</span>
      </button>
    </div>
  );
}

export function ContactSettingsPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const c = state.profile.contact;
  const set = (patch: Partial<ContactSettings>) => {
    dispatch({ type: 'updateProfile', profile: { contact: { ...c, ...patch } } });
    toast('Einstellung gespeichert.');
  };
  const options: { value: ContactSettings['messagesFrom']; label: string }[] = [
    { value: 'alle', label: 'Alle Mitglieder' },
    { value: 'gemeinsame-interessen', label: 'Nur Menschen mit gemeinsamen Interessen' },
    { value: 'niemand', label: 'Niemand – ich schreibe selbst zuerst' },
  ];
  return (
    <div className="page">
      <PageHeader title="Kontaktaufnahme" backTo="/profil" backLabel="Zurück zum Profil" />
      <section className="card">
        <fieldset className="radio-group">
          <legend className="card-heading">Wer darf dir Nachrichten schreiben?</legend>
          {options.map((o) => (
            <label key={o.value} className="radio">
              <input type="radio" name="messagesFrom" checked={c.messagesFrom === o.value} onChange={() => set({ messagesFrom: o.value })} />
              <span>{o.label}</span>
            </label>
          ))}
        </fieldset>
      </section>
      <section className="card stack-md">
        <Switch id="sw-proposals" label="Treffenvorschläge erhalten" hint="Andere dürfen dir ein persönliches Treffen vorschlagen." checked={c.allowProposals} onChange={(v) => set({ allowProposals: v })} />
        <Switch id="sw-age" label="Alter anzeigen" hint="Dein ungefähres Alter ist in deinem Profil sichtbar." checked={c.showAge} onChange={(v) => set({ showAge: v })} />
        <Switch id="sw-district" label="Stadtteil anzeigen" hint="Andere sehen nur den Stadtteil, nie deine Adresse." checked={c.showDistrict} onChange={(v) => set({ showDistrict: v })} />
      </section>
      <DemoNote>Diese Einstellungen werden in der Demo gespeichert, wirken aber noch nicht auf andere Nutzer, da es keine echten Mitglieder gibt.</DemoNote>
    </div>
  );
}

export function PrivacyPage() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  return (
    <div className="page">
      <PageHeader title="Datenschutz" backTo="/profil" backLabel="Zurück zum Profil" />
      <section className="card stack-md">
        <h2 className="card-heading">Deine Daten in dieser Demo</h2>
        <InfoLine icon={<Database />}>
          Alle Angaben, Nachrichten und Anmeldungen werden <strong>nur auf diesem Gerät</strong> im Browser gespeichert. Es
          werden keine Daten an AMIVO oder Dritte übertragen.
        </InfoLine>
        <InfoLine icon={<Lock />}>
          Wir fragen nur, was für eine Funktion nötig ist. Fast alle Angaben sind freiwillig – nur der Vorname wird für
          die persönliche Ansprache benötigt.
        </InfoLine>
        <InfoLine icon={<ShieldCheck />}>
          Andere sehen niemals deine genaue Adresse. Beim Standort wird höchstens dein Stadtteil angezeigt.
        </InfoLine>
        <InfoLine icon={<UserCheck />}>
          Angehörige, die bei der Einrichtung helfen, erhalten keinen Zugriff auf deine Nachrichten.
        </InfoLine>
        <InfoLine icon={<Trash2 />}>
          Du kannst alle Daten jederzeit über <Link to="/profil">Profil → Konto löschen</Link> entfernen.
        </InfoLine>
      </section>

      <section className="card">
        <h2 className="card-heading">Blockierte Personen</h2>
        {state.blocked.length === 0 ? (
          <p className="muted">Du hast niemanden blockiert.</p>
        ) : (
          <ul className="plain-list stack-sm">
            {state.blocked.map((id) => {
              const p = findPerson(id);
              if (!p) return null;
              return (
                <li key={id} className="blocked-row">
                  <Avatar name={p.firstName} tone={p.tone} size={48} />
                  <strong>{p.firstName}</strong>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      dispatch({ type: 'unblock', personId: id });
                      toast(`Die Blockierung von ${p.firstName} wurde aufgehoben.`, 'info');
                    }}
                  >
                    Blockierung aufheben
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <DemoNote title="Für den echten Betrieb">
        Vor dem Start einer echten Version werden eine vollständige Datenschutzerklärung, Einwilligungen nach DSGVO,
        verschlüsselte Speicherung, sichere Anmeldung und ein geprüfter Ablauf zur Kontolöschung umgesetzt.
      </DemoNote>
    </div>
  );
}

function InfoLine({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="info-line">
      <span className="info-line-icon" aria-hidden>
        {icon}
      </span>
      <p>{children}</p>
    </div>
  );
}

export function AccessibilityPage() {
  const { state, dispatch } = useStore();
  const a = state.a11y;
  return (
    <div className="page">
      <PageHeader title="Barrierefreiheit" backTo="/profil" backLabel="Zurück zum Profil" />
      <p className="muted">Änderungen werden sofort übernommen und gespeichert.</p>
      <section className="card">
        <h2 className="card-heading">Schriftgröße</h2>
        <p className="muted">Tippe auf die Größe, die du am besten lesen kannst. Die ganze App passt sich sofort an.</p>
        <FontSizePicker name="font-size-settings" />
        <p className="font-preview">So sieht ein Text in dieser Größe aus: Gemeinsam statt einsam.</p>
      </section>
      <section className="card stack-md">
        <Switch id="sw-contrast" label="Hoher Kontrast" hint="Kräftigere Farben und deutlichere Ränder." checked={a.highContrast} onChange={(v) => dispatch({ type: 'setA11y', a11y: { highContrast: v } })} />
        <Switch id="sw-motion" label="Bewegungen reduzieren" hint="Schaltet Animationen und Übergänge ab." checked={a.reduceMotion} onChange={(v) => dispatch({ type: 'setA11y', a11y: { reduceMotion: v } })} />
      </section>
      <section className="card">
        <h2 className="card-heading">Weitere Tipps</h2>
        <ul className="check-list">
          <li>Die Schriftgröße kannst du auch jederzeit oben über die Schaltfläche „Schrift“ ändern.</li>
          <li>Du kannst die Ansicht auch mit zwei Fingern vergrößern.</li>
          <li>Die App funktioniert mit der Vorlesefunktion deines Geräts (VoiceOver oder TalkBack).</li>
          <li>Alle Funktionen sind auch mit der Tastatur bedienbar.</li>
        </ul>
      </section>
    </div>
  );
}
