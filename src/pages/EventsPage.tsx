import { CalendarPlus, CalendarSearch, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EventCard } from '../components/cards';
import { DemoNote, EmptyState, PageHeader, ToggleChip } from '../components/ui';
import { CATEGORIES } from '../data/catalog';
import { DEMO_EVENTS } from '../data/demoEvents';
import {
  DEFAULT_FILTERS,
  filterEvents,
  isDefaultFilters,
  withDates,
  type EventFilters,
  type TimeFilter,
} from '../lib/eventFilters';
import { useStore } from '../state/AppStore';
import { MyMeetings } from './MyMeetings';

const TIME_OPTIONS: { id: TimeFilter; label: string }[] = [
  { id: 'heute', label: 'Heute' },
  { id: 'woche', label: 'Diese Woche' },
  { id: 'wochenende', label: 'Wochenende' },
];

export default function EventsPage() {
  const [params, setParams] = useSearchParams();
  const view = params.get('ansicht') === 'meine' ? 'meine' : 'entdecken';

  return (
    <div className="page">
      <PageHeader
        title="Treffen"
        subtitle="Finde dein nächstes Treffen – gemeinsam etwas erleben."
        actions={
          <Link to="/treffen/neu" className="btn btn-secondary btn-sm">
            <CalendarPlus aria-hidden size={22} /> Treffen erstellen
          </Link>
        }
      />
      <div className="segmented" role="tablist" aria-label="Ansicht wählen">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'entdecken'}
          className="segment"
          onClick={() => setParams({}, { replace: true })}
        >
          Entdecken
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'meine'}
          className="segment"
          onClick={() => setParams({ ansicht: 'meine' }, { replace: true })}
        >
          Meine Treffen
        </button>
      </div>
      {view === 'entdecken' ? <Discover /> : <MyMeetings />}
    </div>
  );
}

function Discover() {
  const { state } = useStore();
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const [moreOpen, setMoreOpen] = useState(false);
  const dated = useMemo(() => withDates(DEMO_EVENTS), []);
  const results = filterEvents(dated, filters);
  const set = (patch: Partial<EventFilters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <>
      <DemoNote title="Beispieltermine">
        Diese Veranstaltungen sind Beispieldaten und noch nicht tatsächlich buchbar.
      </DemoNote>

      <section className="filters" aria-label="Treffen filtern">
        <h2 className="filter-heading">Wann?</h2>
        <div className="chip-row">
          {TIME_OPTIONS.map((o) => (
            <ToggleChip
              key={o.id}
              pressed={filters.time === o.id}
              onToggle={() => set({ time: filters.time === o.id ? 'alle' : o.id })}
            >
              {o.label}
            </ToggleChip>
          ))}
          <ToggleChip pressed={filters.freeOnly} onToggle={() => set({ freeOnly: !filters.freeOnly })}>
            Kostenlos
          </ToggleChip>
        </div>

        <h2 className="filter-heading">Was?</h2>
        <div className="chip-row">
          {CATEGORIES.map((c) => (
            <ToggleChip
              key={c.id}
              pressed={filters.category === c.id}
              onToggle={() => set({ category: filters.category === c.id ? 'alle' : c.id })}
            >
              {c.label}
            </ToggleChip>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-ghost"
          aria-expanded={moreOpen}
          aria-controls="more-filters"
          onClick={() => setMoreOpen((v) => !v)}
        >
          <SlidersHorizontal aria-hidden size={22} />
          {moreOpen ? 'Weniger Filter' : 'Weitere Filter: Zugänglichkeit und Aktivität'}
        </button>
        {moreOpen && (
          <div id="more-filters" className="chip-row">
            <ToggleChip pressed={filters.stepFreeOnly} onToggle={() => set({ stepFreeOnly: !filters.stepFreeOnly })}>
              Stufenlos zugänglich
            </ToggleChip>
            <ToggleChip pressed={filters.easyOnly} onToggle={() => set({ easyOnly: !filters.easyOnly })}>
              Leichtes Aktivitätsniveau
            </ToggleChip>
          </div>
        )}
      </section>

      <div className="result-bar">
        <p aria-live="polite" className="result-count">
          {results.length === 1 ? '1 Treffen gefunden' : `${results.length} Treffen gefunden`}
        </p>
        {!isDefaultFilters(filters) && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
            <RotateCcw aria-hidden size={20} /> Filter zurücksetzen
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<CalendarSearch size={40} />}
          title="Keine passenden Treffen gefunden"
          action={
            <button type="button" className="btn btn-primary" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Alle Treffen anzeigen
            </button>
          }
        >
          Probiere einen anderen Filter aus – oder schlage selbst ein Treffen vor.
        </EmptyState>
      ) : (
        <div className="card-grid">
          {results.map(({ event, date }) => (
            <EventCard key={event.id} event={event} date={date} registered={state.registrations.includes(event.id)} />
          ))}
        </div>
      )}
    </>
  );
}
