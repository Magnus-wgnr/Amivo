import { CalendarHeart, CircleHelp, Home, MessageCircle, Phone, User, Users } from 'lucide-react';
import { Suspense, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { totalUnread } from '../state/reducer';
import { useStore } from '../state/AppStore';
import { Logo, Spinner } from './ui';

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

      <main id="inhalt" ref={mainRef} tabIndex={-1} className="main" key={location.pathname}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
