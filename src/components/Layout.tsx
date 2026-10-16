import { CalendarHeart, CircleHelp, Home, MessageCircle, Phone, Type, User, Users } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { totalUnread } from '../state/reducer';
import { useStore } from '../state/AppStore';
import { FontSizePicker, fontScaleLabel } from './FontSizePicker';
import { Dialog, Logo, Spinner } from './ui';

const NAV = [
  { to: '/', label: 'Startseite', icon: Home, end: true },
  { to: '/menschen', label: 'Menschen', icon: Users },
  { to: '/treffen', label: 'Treffen', icon: CalendarHeart },
  { to: '/hotline', label: 'Hotline', icon: Phone },
  { to: '/profil', label: 'Profil', icon: User },
];

export function Layout() {
  const { state } = useStore();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const unread = totalUnread(state);
  const firstRender = useRef(true);
  const [fontOpen, setFontOpen] = useState(false);

  // Nach jedem Seitenwechsel nach oben scrollen und den Fokus auf die Überschrift setzen,
  // damit Screenreader den neuen Seitentitel vorlesen.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const heading = mainRef.current?.querySelector<HTMLElement>('h1');
    heading?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      {/* Button statt Anker, weil der HashRouter #-Links als Seitenwechsel interpretiert */}
      <button type="button" className="skip-link" onClick={() => mainRef.current?.focus()}>
        Zum Inhalt springen
      </button>
      <div className="demo-banner" role="note">
        <span>
          <strong>Demo-Version:</strong> Beispieldaten, nichts wird an einen Server gesendet.
        </span>
        <Link to="/demo">Was ist Demo?</Link>
      </div>
      <header className="topbar">
        <Link to="/" className="topbar-logo" aria-label="AMIVO – zur Startseite">
          <Logo />
        </Link>
        <div className="topbar-actions">
          <button
            type="button"
            className="topbar-btn"
            onClick={() => setFontOpen(true)}
            aria-label={`Schriftgröße ändern, aktuell: ${fontScaleLabel(state.a11y.fontScale)}`}
          >
            <Type aria-hidden size={24} />
            <span>Schrift</span>
          </button>
          <Link to="/nachrichten" className="topbar-btn">
            <MessageCircle aria-hidden size={24} />
            <span>Nachrichten</span>
            {unread > 0 && (
              <span className="count-pill">
                {unread} <span className="visually-hidden">ungelesen</span>
              </span>
            )}
          </Link>
          <Link to="/hilfe" className="topbar-btn">
            <CircleHelp aria-hidden size={24} />
            <span>Hilfe</span>
          </Link>
        </div>
      </header>

      <nav className="main-nav" aria-label="Hauptnavigation">
        <div className="main-nav-logo">
          <Logo />
          <p className="slogan">Gemeinsam statt einsam.</p>
        </div>
        <ul>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                <Icon aria-hidden size={26} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Dialog
        open={fontOpen}
        onClose={() => setFontOpen(false)}
        title="Schriftgröße"
        footer={
          <button type="button" className="btn btn-primary btn-block btn-lg" onClick={() => setFontOpen(false)}>
            Fertig
          </button>
        }
      >
        <p>Tippe auf die Größe, die du am besten lesen kannst. Die App passt sich sofort an.</p>
        <FontSizePicker name="font-size-dialog" />
        <p className="font-dialog-preview">So sieht ein Text in dieser Größe aus: Gemeinsam statt einsam.</p>
        <p className="small muted">Weitere Einstellungen wie hoher Kontrast findest du unter Profil → Barrierefreiheit.</p>
      </Dialog>

      <main id="inhalt" ref={mainRef} tabIndex={-1} className="main" key={location.pathname}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
