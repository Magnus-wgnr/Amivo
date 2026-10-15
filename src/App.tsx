import { lazy } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useStore } from './state/AppStore';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';

// Unterseiten werden bei Bedarf nachgeladen (mit Ladeanzeige im Layout)
const PeoplePage = lazy(() => import('./pages/PeoplePage'));
const PersonDetailPage = lazy(() => import('./pages/PersonDetailPage'));
const ProposeMeetingPage = lazy(() => import('./pages/ProposeMeetingPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const CreateEventPage = lazy(() => import('./pages/CreateEventPage'));
const HotlinePage = lazy(() => import('./pages/HotlinePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ContactSettingsPage = lazy(() => import('./pages/SettingsPages').then((m) => ({ default: m.ContactSettingsPage })));
const PrivacyPage = lazy(() => import('./pages/SettingsPages').then((m) => ({ default: m.PrivacyPage })));
const AccessibilityPage = lazy(() => import('./pages/SettingsPages').then((m) => ({ default: m.AccessibilityPage })));
const HelpPage = lazy(() => import('./pages/HelpPages').then((m) => ({ default: m.HelpPage })));
const DemoInfoPage = lazy(() => import('./pages/HelpPages').then((m) => ({ default: m.DemoInfoPage })));

export default function App() {
  const { state } = useStore();

  if (!state.onboarded) return <OnboardingPage />;

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="menschen" element={<PeoplePage />} />
          <Route path="menschen/:id" element={<PersonDetailPage />} />
          <Route path="menschen/:id/treffen-vorschlagen" element={<ProposeMeetingPage />} />
          <Route path="treffen-vorschlagen" element={<ProposeMeetingPage />} />
          <Route path="treffen" element={<EventsPage />} />
          <Route path="treffen/neu" element={<CreateEventPage />} />
          <Route path="treffen/:id" element={<EventDetailPage />} />
          <Route path="hotline" element={<HotlinePage />} />
          <Route path="nachrichten" element={<MessagesPage />} />
          <Route path="nachrichten/:id" element={<ChatPage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="profil/bearbeiten" element={<ProfileEditPage />} />
          <Route path="profil/kontakt" element={<ContactSettingsPage />} />
          <Route path="profil/datenschutz" element={<PrivacyPage />} />
          <Route path="profil/barrierefreiheit" element={<AccessibilityPage />} />
          <Route path="hilfe" element={<HelpPage />} />
          <Route path="demo" element={<DemoInfoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
