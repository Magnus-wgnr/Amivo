# AMIVO – Gemeinsam statt einsam

Mobile-first Web-App für Senioren: neue Menschen kennenlernen, Gemeinschaftstreffen entdecken und bei Bedarf über die Hotline mit jemandem sprechen.

> **Demo-Version:** Die App läuft ohne Backend. Alle Veranstaltungen und Personenprofile sind Beispieldaten. Nachrichten, Anmeldungen und Treffenvorschläge werden nur lokal im Browser gespeichert (`localStorage`). Die App kennzeichnet das an allen betroffenen Stellen und auf der Seite „Über diese Demo“.

## Starten

```bash
npm install
npm run dev        # Entwicklungsserver
npm run build      # Typprüfung + Produktions-Build nach dist/
npm run preview    # Build lokal ansehen
npm test           # Unit-Tests (Vitest)
```

Der Build verwendet relative Pfade und einen Hash-Router und lässt sich deshalb auf jedem statischen Hosting veröffentlichen (z. B. GitHub Pages).

## Hotline konfigurieren

Die Hotline-Nummer kommt aus der Umgebungsvariable `VITE_HOTLINE_PHONE` (siehe `.env.example`).

- **Keine Nummer gesetzt:** Die Schaltfläche „Jetzt anrufen“ öffnet einen Hinweis, dass es sich um eine Demo handelt. Es wird kein Anruf vorgetäuscht.
- **Gültige Nummer gesetzt:** Die Schaltfläche öffnet über `tel:` die Telefonfunktion des Geräts.

Erreichbarkeit, Kosten, Team und Unterstützungsangebote stehen in `src/config.ts`. Sobald echte Angaben eingetragen sind, `contentIsExample` auf `false` setzen.

## Funktionen

| Bereich | Inhalt |
| --- | --- |
| **Startseite** | Persönliche Begrüßung, drei große Funktionskarten (Hotline, Treffen, Menschen), nächste eigene Treffen, kommende Veranstaltungen, passende Kontakte, neue Aktivitäten, Hilfe |
| **Menschen** | Fiktive Beispielprofile, Filter „gemeinsame Interessen“, Profilansicht mit Erklärung der Gemeinsamkeiten, Melden und Blockieren, Sicherheitshinweise |
| **Treffen** | Filter (Heute, Diese Woche, Wochenende, Kostenlos, Kategorien, stufenlos zugänglich, leichtes Aktivitätsniveau), Detailseite, Demo-Anmeldung „Ich bin dabei“ ohne doppelte Anmeldungen, „Meine Treffen“ mit Status (Ausstehend, Angenommen, Abgelehnt), eigene Treffen anlegen (landen zuerst „in Prüfung“) |
| **Treffen vorschlagen** | Ablauf in sechs Schritten: Person → Aktivität → Termin → Treffpunkt → Nachricht → Prüfen. Empfangene Vorschläge annehmen, ablehnen oder einen anderen Termin vorschlagen |
| **Nachrichten** | Gesprächsliste, Chat mit großer Senden-Schaltfläche, Vorschläge für die erste Nachricht, gekennzeichnete automatische Demo-Antworten |
| **Hotline** | „Du möchtest reden?“, Anruf-Schaltfläche, Erreichbarkeit, Kosten, wer die Gespräche führt, Abgrenzung zu Therapie, Notruf 112 und TelefonSeelsorge |
| **Profil** | Profil bearbeiten (Foto, Vorname, Altersspanne, Stadtteil, Beschreibung, Interessen, bevorzugte Aktivitäten), Kontaktaufnahme, Datenschutz (inkl. blockierte Personen), Barrierefreiheit, Hilfe, Abmelden, Konto löschen |
| **Ersteinrichtung** | Begrüßung, Vorname, Interessen, optionaler Stadtteil, Erklärung der App. Jederzeit „Später einrichten“, einzelne Schritte lassen sich überspringen, Option für helfende Angehörige |

## Barrierefreiheit

- Grundschrift 18 px, umschaltbar auf „Groß“ und „Sehr groß“; hoher Kontrast; Animationen abschaltbar (beachtet auch `prefers-reduced-motion`)
- Schaltflächen mindestens 48–56 px hoch, alle Symbole mit Textbeschriftung
- Status nie nur über Farbe: immer mit Symbol und Text
- Gut sichtbare „Zurück“-Schaltflächen, Fokus springt nach jedem Seitenwechsel auf die Überschrift, „Zum Inhalt springen“-Schaltfläche
- Native `<dialog>`-Elemente, `aria-pressed`, `aria-live`-Rückmeldungen, verständliche Formularfehler
- Auf Tablet und Desktop wird die untere Navigationsleiste zur Seitenleiste

## Architektur

```
src/
  config.ts            Hotline-Konfiguration
  types.ts             Datenmodell (Personen, Treffen, Vorschläge, Nachrichten, Profil)
  data/                Beispieldaten und Stammdaten (Interessen, Aktivitäten, Kategorien)
  lib/                 Reine Logik: Termine, Filter, Matching, Validierung, Telefonnummern
  state/               Reducer (Geschäftslogik) + React-Context-Store
  services/storage.ts  Lokale Speicherung, später durch eine Backend-API ersetzen
  components/          Wiederverwendbare UI-Bausteine (Karten, Dialog, Toast, Layout …)
  pages/               Seiten (werden nachgeladen)
  __tests__/           Unit-Tests für die Logik
```

Darstellung, Daten und Geschäftslogik sind getrennt. Für den echten Betrieb wird `services/storage.ts` durch einen API-Client ersetzt. Der Reducer bildet die Aktionen ab, die ein Backend dann anbieten muss.

## Vor einem echten Start

- Backend mit sicherer Authentifizierung, serverseitigen Berechtigungsprüfungen und verschlüsselter Speicherung von Profilen, Nachrichten und Anmeldungen
- Zuverlässige Zustellung und Synchronisierung von Nachrichten und Treffenvorschlägen
- Moderation: Prüfung neuer Treffen und Bearbeitung von Meldungen
- Datenschutzerklärung, Einwilligungen nach DSGVO, Löschkonzept, Auftragsverarbeitung
- Echte Hotline-Rufnummer, Zeiten und Kosten in `src/config.ts` eintragen
- Prüfung der Barrierefreiheit mit Nutzerinnen und Nutzern der Zielgruppe
