import { ACTIVITIES, INTERESTS } from '../data/catalog';
import type { ActivityId, InterestId } from '../types';
import { ToggleChip } from './ui';

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function InterestPicker({ value, onChange, label = 'Interessen' }: { value: InterestId[]; onChange: (v: InterestId[]) => void; label?: string }) {
  return (
    <div role="group" aria-label={label}>
      <div className="chip-row">
        {INTERESTS.map((i) => (
          <ToggleChip key={i.id} pressed={value.includes(i.id)} onToggle={() => onChange(toggle(value, i.id))}>
            {i.label}
          </ToggleChip>
        ))}
      </div>
      <p className="muted small" aria-live="polite">
        {value.length === 0 ? 'Noch nichts ausgewählt.' : `${value.length} ausgewählt`}
      </p>
    </div>
  );
}

export function ActivityPicker({ value, onChange }: { value: ActivityId[]; onChange: (v: ActivityId[]) => void }) {
  return (
    <div role="group" aria-label="Bevorzugte Aktivitäten" className="chip-row">
      {ACTIVITIES.map((a) => (
        <ToggleChip key={a.id} pressed={value.includes(a.id)} onToggle={() => onChange(toggle(value, a.id))}>
          {a.label}
        </ToggleChip>
      ))}
    </div>
  );
}
