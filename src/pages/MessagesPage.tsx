import { ChevronRight, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, DemoNote, EmptyState, PageHeader } from '../components/ui';
import { DEMO_PEOPLE } from '../data/demoPeople';
import { formatMessageTime } from '../lib/dates';
import { unreadCount } from '../state/reducer';
import { useStore } from '../state/AppStore';

export default function MessagesPage() {
  const { state } = useStore();
  const conversations = DEMO_PEOPLE.filter((p) => !state.blocked.includes(p.id))
    .map((person) => {
      const msgs = state.messages.filter((m) => m.personId === person.id);
      return { person, last: msgs[msgs.length - 1], unread: unreadCount(state, person.id) };
    })
    .filter((c) => c.last)
    .sort((a, b) => b.last!.sentAt.localeCompare(a.last!.sentAt));

  return (
    <div className="page">
      <PageHeader title="Nachrichten" backTo="-1" />
      <DemoNote>Nachrichten funktionieren nur in dieser Demo und werden ausschließlich auf diesem Gerät gespeichert.</DemoNote>
      {conversations.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare size={40} />}
          title="Noch keine Gespräche"
          action={
            <Link to="/menschen" className="btn btn-primary">
              Menschen entdecken
            </Link>
          }
        >
          Schreib jemandem mit ähnlichen Interessen – ein kurzes Hallo genügt.
        </EmptyState>
      ) : (
        <ul className="plain-list conversation-list">
          {conversations.map(({ person, last, unread }) => (
            <li key={person.id}>
              <Link to={`/nachrichten/${person.id}`} className="card conversation">
                <Avatar name={person.firstName} tone={person.tone} size={56} />
                <span className="conversation-text">
                  <span className="conversation-top">
                    <strong>{person.firstName}</strong>
                    <span className="muted small">{formatMessageTime(last!.sentAt)}</span>
                  </span>
                  <span className={`conversation-preview${unread ? ' unread' : ''}`}>
                    {last!.from === 'me' ? 'Du: ' : ''}
                    {last!.text.split('\n')[0]}
                  </span>
                  {unread > 0 && <span className="badge badge-new">{unread === 1 ? '1 neue Nachricht' : `${unread} neue Nachrichten`}</span>}
                </span>
                <ChevronRight aria-hidden size={24} />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/menschen" className="btn btn-secondary btn-block">
        Neues Gespräch beginnen
      </Link>
    </div>
  );
}
