import { Check } from 'lucide-react';
import { useStore } from '../state/AppStore';
import type { FontScale } from '../types';

export const FONT_OPTIONS: { value: FontScale; label: string; percent: number }[] = [
  { value: 'normal', label: 'Normal', percent: 100 },
  { value: 'gross', label: 'Groß', percent: 115 },
  { value: 'sehr-gross', label: 'Sehr groß', percent: 130 },
  { value: 'extra-gross', label: 'Extra groß', percent: 147 },
];

/**
 * Große, gut erkennbare Auswahl der Schriftgröße. Jede Option zeigt ein „Aa“
 * in der jeweiligen Größe, damit der Unterschied ohne Lesen sichtbar ist.
 * Die Änderung gilt sofort für die ganze App und wird gespeichert.
 */
export function FontSizePicker({ name = 'font-size' }: { name?: string }) {
  const { state, dispatch } = useStore();
  const current = state.a11y.fontScale;

  return (
    <fieldset className="font-picker">
      <legend className="visually-hidden">Schriftgröße wählen</legend>
      {FONT_OPTIONS.map((o) => {
        const selected = current === o.value;
        return (
          <label key={o.value} className={`font-option${selected ? ' selected' : ''}`}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={selected}
              onChange={() => dispatch({ type: 'setA11y', a11y: { fontScale: o.value } })}
            />
            <span className="font-option-sample" style={{ fontSize: `${1.4 * (o.percent / 100)}rem` }} aria-hidden>
              Aa
            </span>
            <span className="font-option-label">
              {o.label}
              {selected && (
                <span className="font-option-check">
                  <Check aria-hidden size={18} strokeWidth={3} /> gewählt
                </span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export function fontScaleLabel(value: FontScale): string {
  return FONT_OPTIONS.find((o) => o.value === value)?.label ?? 'Normal';
}
