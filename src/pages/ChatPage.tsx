import { CalendarPlus, Lightbulb, Send, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, DemoBadge, EmptyState, Note, PageHeader } from '../components/ui';
import { findPerson } from '../data/demoPeople';
import { formatMessageTime } from '../lib/dates';
import { messageSuggestions } from '../lib/matching';
import { newId } from '../services/storage';
import { useStore } from '../state/AppStore';

const DEMO_REPLIES = [
  'Wie schön, von dir zu hören! Ich melde mich bald ausführlicher.',
  'Das klingt gut! Lass uns gern etwas ausmachen.',
  'Danke für deine Nachricht – ich freue mich!',
];

export default function ChatPage() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const listEnd = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | undefined>(undefined);
  const person = findPerson(id);
  const blocked = person ? state.blocked.includes(person.id) : false;
  const messages = state.messages.filter((m) => m.personId === person?.id);

  useEffect(() => {
    if (person) dispatch({ type: 'markRead', personId: person.id, at: new Date().toISOString() });
  }, [person?.id, messages.length]);

  useEffect(() => {
    listEnd.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, typing]);

  useEffect(() => () => window.clearTimeout(replyTimer.current), []);

  if (!person) {
    return (
      <div className="page">
        <PageHeader title="Gespräch nicht gefunden" backTo="/nachrichten" />
        <EmptyState icon={<UserRound size={40} />} title="Dieses Gespräch gibt es nicht." />
      </div>
    );
  }

  const send = (value: string) => {
    const clean = value.trim();
    if (!clean || blocked) return;
    dispatch({
      type: 'sendMessage',
      message: { id: newId('msg'), personId: person.id, from: 'me', text: clean, sentAt: new Date().toISOString() },
    });
    setText('');
    // Demo: automatische, klar gekennzeichnete Antwort des Beispielprofils
    setTyping(true);
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      setTyping(false);
      dispatch({
        type: 'sendMessage',
        message: {
          id: newId('msg'),
          personId: person.id,
          from: 'them',
          text: DEMO_REPLIES[messages.length % DEMO_REPLIES.length],
          sentAt: new Date().toISOString(),
          demoAuto: true,
        },
      });
    }, 1800);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  const suggestions = messageSuggestions(state.profile.interests, person);

  return (
    <div className="page page-chat">
      <PageHeader
        title={person.firstName}
        backTo="/nachrichten"
        backLabel="Alle Nachrichten"
        actions={
          <Link to={`/menschen/${person.id}`} className="btn btn-ghost btn-sm">
            <UserRound aria-hidden size={20} /> Profil
          </Link>
        }
      />
      <Note icon={<ShieldCheck size={22} />} tone="safety">
        Gib persönliche Daten wie Adresse oder Bankverbindung nicht vorschnell weiter. <DemoBadge>Demo-Chat</DemoBadge>
      </Note>

      <div className="chat-log" role="log" aria-label={`Gespräch mit ${person.firstName}`} aria-live="polite">
        {messages.length === 0 && (
          <p className="muted chat-empty">Noch keine Nachrichten. Ein kurzes Hallo ist ein guter Anfang!</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`bubble-row ${m.from === 'me' ? 'mine' : 'theirs'}`}>
            {m.from === 'them' && <Avatar name={person.firstName} tone={person.tone} size={40} />}
            <div className={`bubble${m.kind === 'proposal' ? ' bubble-proposal' : ''}`}>
              <span className="visually-hidden">{m.from === 'me' ? 'Du' : person.firstName} schreibt: </span>
              {m.kind === 'proposal' && (
                <span className="bubble-tag">
                  <CalendarPlus aria-hidden size={16} /> Treffenvorschlag
                </span>
              )}
              <p>{m.text}</p>
              <span className="bubble-meta">
                {m.from === 'me' ? 'Du' : person.firstName} · {formatMessageTime(m.sentAt)}
                {m.demoAuto && ' · automatische Demo-Antwort'}
              </span>
            </div>
          </div>
        ))}
        {typing && (
          <p className="muted typing">
            {person.firstName} schreibt … <span className="small">(Demo)</span>
          </p>
        )}
        <div ref={listEnd} />
      </div>

      {blocked ? (
        <Note>Du hast {person.firstName} blockiert. Hebe die Blockierung unter Profil → Datenschutz auf, um wieder zu schreiben.</Note>
      ) : (
        <>
          {messages.filter((m) => m.from === 'me').length === 0 && (
            <div className="suggestions">
              <p className="suggestions-title">
                <Lightbulb aria-hidden size={20} /> Ideen für deine erste Nachricht – zum Antippen:
              </p>
              <ul className="plain-list stack-sm">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button type="button" className="suggestion" onClick={() => setText(s)}>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form className="composer" onSubmit={onSubmit}>
            <label htmlFor="chat-input" className="visually-hidden">
              Deine Nachricht an {person.firstName}
            </label>
            <textarea
              id="chat-input"
              className="input composer-input"
              rows={2}
              placeholder="Schreibe eine Nachricht …"
              value={text}
              maxLength={1000}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-send" disabled={!text.trim()}>
              <Send aria-hidden size={24} />
              Senden
            </button>
          </form>
          <Link to={`/menschen/${person.id}/treffen-vorschlagen`} className="btn btn-ghost btn-block">
            <CalendarPlus aria-hidden size={22} /> Treffen mit {person.firstName} vorschlagen
          </Link>
        </>
      )}
    </div>
  );
}
