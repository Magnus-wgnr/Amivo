import {
  Accessibility,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  LogOut,
  MessageCircle,
  Navigation,
  Pencil,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InterestTags } from '../components/cards';
import { Avatar, DemoBadge, Dialog, PageHeader } from '../components/ui';
import { activityLabel } from '../data/catalog';
import { useStore } from '../state/AppStore';

export default function ProfilePage() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<'none' | 'logout' | 'delete'>('none');
  const { profile } = state;

  return (
    <div className="page">
      <PageHeader title="Mein Profil" />
      <section className="card profile-hero">
        <Avatar name={profile.firstName || '?'} tone={profile.tone} photo={profile.photo} size={112} />
        <div>
          <h2 className="profile-name">
            {profile.firstName || 'Ohne Namen'}
            {profile.ageRange && profile.contact.showAge && <span>, {profile.ageRange.replace('-', '–')} Jahre</span>}
          </h2>
          {profile.district && (
            <p className="muted person-place">
              <Navigation aria-hidden size={18} /> Hamburg-{profile.district}
            </p>
          )}
          <DemoBadge>Demo-Profil</DemoBadge>
        </div>
      </section>

      <Link to="/profil/bearbeiten" className="btn btn-primary btn-block btn-lg">
        <Pencil aria-hidden size={22} /> Profil bearbeiten
      </Link>

      <section className="card">
        <h2 className="card-heading">Über mich</h2>
        <p>{profile.bio || <span className="muted">Noch keine Beschreibung. Du kannst sie jederzeit ergänzen.</span>}</p>
      </section>

      <section className="card">
        <h2 className="card-heading">Meine Interessen</h2>
        {profile.interests.length ? (
          <InterestTags interests={profile.interests} />
        ) : (
          <p className="muted">Noch keine Interessen ausgewählt.</p>
        )}
        <h3 className="sub-heading">Das unternehme ich gern</h3>
        {profile.preferredActivities.length ? (
          <ul className="tag-list">
            {profile.preferredActivities.map((a) => (
              <li key={a} className="tag">
                {activityLabel(a)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Noch keine Aktivitäten ausgewählt.</p>
        )}
      </section>

      <nav aria-label="Einstellungen" className="card menu-card">
        <h2 className="card-heading">Einstellungen</h2>
        <ul className="plain-list">
          <MenuLink to="/profil/kontakt" icon={<MessageCircle />} label="Kontaktaufnahme" hint="Wer dir schreiben darf" />
          <MenuLink to="/profil/datenschutz" icon={<ShieldCheck />} label="Datenschutz" hint="Deine Daten und blockierte Personen" />
          <MenuLink to="/profil/barrierefreiheit" icon={<Accessibility />} label="Barrierefreiheit" hint="Schriftgröße, Kontrast, Bewegung" />
          <MenuLink to="/hilfe" icon={<CircleHelp />} label="Hilfe und Support" hint="Häufige Fragen und Tipps" />
          <MenuLink to="/demo" icon={<FlaskConical />} label="Über diese Demo" hint="Was echt ist und was nicht" />
        </ul>
      </nav>

      <div className="button-stack">
        <button type="button" className="btn btn-secondary btn-block" onClick={() => setDialog('logout')}>
          <LogOut aria-hidden size={22} /> Abmelden
        </button>
        <button type="button" className="btn btn-ghost btn-block btn-danger-text" onClick={() => setDialog('delete')}>
          <Trash2 aria-hidden size={22} /> Konto löschen
        </button>
      </div>

      <Dialog
        open={dialog === 'logout'}
        onClose={() => setDialog('none')}
        title="Abmelden?"
        footer={
          <>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                setDialog('none');
                dispatch({ type: 'restartOnboarding' });
                navigate('/');
              }}
            >
              Ja, abmelden
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => setDialog('none')}>
              Abbrechen
            </button>
          </>
        }
      >
        <p>
          In der Demo gibt es kein echtes Benutzerkonto. Beim Abmelden kehrst du zum Begrüßungsbildschirm zurück – deine
          Demo-Daten bleiben auf diesem Gerät erhalten.
        </p>
      </Dialog>

      <Dialog
        open={dialog === 'delete'}
        onClose={() => setDialog('none')}
        title="Konto wirklich löschen?"
        footer={
          <>
            <button
              type="button"
              className="btn btn-danger btn-block"
              onClick={() => {
                setDialog('none');
                dispatch({ type: 'deleteAccount', now: new Date() });
                navigate('/');
              }}
            >
              Ja, alles löschen
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={() => setDialog('none')}>
              Abbrechen
            </button>
          </>
        }
      >
        <p>
          Alle deine Angaben, Nachrichten, Anmeldungen und Treffenvorschläge werden von diesem Gerät gelöscht. Das kann
          nicht rückgängig gemacht werden.
        </p>
        <p className="small muted">Demo: Es werden nur die lokal gespeicherten Daten gelöscht. Die Demo startet danach neu.</p>
      </Dialog>
    </div>
  );
}

function MenuLink({ to, icon, label, hint }: { to: string; icon: ReactNode; label: string; hint: string }) {
  return (
    <li>
      <Link to={to} className="menu-link">
        <span className="menu-icon" aria-hidden>
          {icon}
        </span>
        <span className="menu-text">
          <strong>{label}</strong>
          <span className="muted small">{hint}</span>
        </span>
        <ChevronRight aria-hidden size={24} />
      </Link>
    </li>
  );
}
