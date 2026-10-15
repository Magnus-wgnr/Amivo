import { MessageCircle, UserSearch } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PersonCard } from '../components/cards';
import { DemoNote, EmptyState, PageHeader, ToggleChip } from '../components/ui';
import { DEMO_PEOPLE } from '../data/demoPeople';
import { commonInterests, rankPeople } from '../lib/matching';
import { useStore } from '../state/AppStore';

export default function PeoplePage() {
  const { state } = useStore();
  const [onlyShared, setOnlyShared] = useState(false);
  const mine = state.profile.interests;
  const visible = rankPeople(
    mine,
    DEMO_PEOPLE.filter((p) => !state.blocked.includes(p.id)),
  ).filter((p) => !onlyShared || commonInterests(mine, p.interests).length > 0);

  return (
    <div className="page">
      <PageHeader
        title="Menschen"
        subtitle="Neue Menschen kennenlernen – mit ähnlichen Interessen, ganz in deiner Nähe."
        actions={
          <Link to="/nachrichten" className="btn btn-secondary btn-sm">
            <MessageCircle aria-hidden size={22} /> Nachrichten
          </Link>
        }
      />
      <DemoNote title="Beispielprofile">
        Alle Profile hier sind frei erfunden und zeigen, wie AMIVO später aussieht. Es sind keine echten Mitglieder.
      </DemoNote>

      <div className="chip-row">
        <ToggleChip pressed={!onlyShared} onToggle={() => setOnlyShared(false)}>
          Alle anzeigen
        </ToggleChip>
        <ToggleChip pressed={onlyShared} onToggle={() => setOnlyShared(true)}>
          Mit gemeinsamen Interessen
        </ToggleChip>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<UserSearch size={40} />}
          title="Gerade niemand mit gemeinsamen Interessen"
          action={
            <Link to="/profil/bearbeiten" className="btn btn-primary">
              Interessen ergänzen
            </Link>
          }
        >
          Ergänze in deinem Profil weitere Interessen, um mehr passende Menschen zu finden.
        </EmptyState>
      ) : (
        <div className="card-grid">
          {visible.map((p) => (
            <PersonCard key={p.id} person={p} myInterests={mine} />
          ))}
        </div>
      )}
    </div>
  );
}
