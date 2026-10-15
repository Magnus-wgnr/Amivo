import { normalizePhoneNumber } from './lib/phone';

/**
 * Zentrale Konfiguration der AMIVO-Hotline.
 *
 * Die Rufnummer wird über die Umgebungsvariable VITE_HOTLINE_PHONE gesetzt
 * (siehe .env.example). Ist keine gültige Nummer hinterlegt, läuft die
 * Hotline-Seite im Demo-Modus und löst keinen Anruf aus.
 *
 * Die Texte unten sind Beispielangaben. Sobald die echte Hotline startet,
 * hier die tatsächlichen Zeiten, Kosten und das Team eintragen und
 * `contentIsExample` auf false setzen.
 */
export interface HotlineConfig {
  phoneNumber: string | null;
  contentIsExample: boolean;
  hours: { days: string; time: string }[];
  costs: string;
  team: string;
  support: string[];
}

const rawPhone = (import.meta.env.VITE_HOTLINE_PHONE as string | undefined) ?? '';

export const hotlineConfig: HotlineConfig = {
  phoneNumber: normalizePhoneNumber(rawPhone),
  contentIsExample: true,
  hours: [
    { days: 'Montag bis Freitag', time: '9:00 bis 18:00 Uhr' },
    { days: 'Samstag und Sonntag', time: '10:00 bis 14:00 Uhr' },
  ],
  costs:
    'Die Kosten werden vor dem Start hier verbindlich angegeben. Ziel ist eine Rufnummer, die für Anrufende kostenfrei ist.',
  team:
    'Geschulte Mitarbeitende und Ehrenamtliche von AMIVO, die gern zuhören. Viele von ihnen sind selbst im Ruhestand.',
  support: [
    'Ein offenes Ohr und ein freundliches Gespräch',
    'Gemeinsam überlegen, welche Treffen oder Aktivitäten passen könnten',
    'Hilfe beim Einstieg in die AMIVO-App',
    'Hinweise auf weitere Beratungsangebote in deiner Nähe',
  ],
};

/** Die App läuft ohne Backend: Daten werden nur lokal im Browser gespeichert. */
export const IS_DEMO = true;
