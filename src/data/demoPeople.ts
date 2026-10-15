import type { Person } from '../types';

// FIKTIVE BEISPIELPROFILE – keine echten registrierten Mitglieder.

export const DEMO_PEOPLE: Person[] = [
  {
    id: 'anna',
    firstName: 'Anna',
    age: 72,
    district: 'Winterhude',
    distanceKm: 1.8,
    interests: ['garten', 'spazieren', 'kultur'],
    intro: 'Ich entdecke gern neue Orte und freue mich über nette Gespräche bei einem Kaffee.',
    about:
      'Ich war früher Buchhändlerin und habe immer noch eine Schwäche für gute Geschichten. Mein kleiner Schrebergarten ist mein Lieblingsort – im Sommer gibt es dort mehr Tomaten, als ich allein essen kann.',
    tone: 'mint',
  },
  {
    id: 'peter',
    firstName: 'Peter',
    age: 76,
    district: 'Altona',
    distanceKm: 4.9,
    interests: ['radfahren', 'schach', 'natur'],
    intro: 'Ich bin gern draußen unterwegs und suche Menschen für gemeinsame Unternehmungen.',
    about:
      'Als ehemaliger Ingenieur tüftle ich gern – am liebsten an Schachaufgaben. Bei gutem Wetter fahre ich mit dem Rad an die Elbe. Ich freue mich über Begleitung, ob auf zwei Rädern oder am Schachbrett.',
    tone: 'petrol',
  },
  {
    id: 'maria',
    firstName: 'Maria',
    age: 69,
    district: 'Eimsbüttel',
    distanceKm: 2.7,
    interests: ['kochen', 'musik', 'ausfluege'],
    intro: 'Ich probiere gern neue Dinge aus und lerne gerne interessante Menschen kennen.',
    about:
      'Ich koche leidenschaftlich gern – am liebsten Rezepte aus aller Welt. Seit einem Jahr singe ich in einem kleinen Chor und entdecke gern bei Tagesausflügen die Umgebung von Hamburg.',
    tone: 'lavender',
  },
  {
    id: 'klaus',
    firstName: 'Klaus',
    age: 74,
    district: 'Eppendorf',
    distanceKm: 0.9,
    interests: ['fotografie', 'geschichte', 'spazieren'],
    intro: 'Ich interessiere mich für Geschichte und bin gern mit anderen unterwegs.',
    about:
      'Mit meiner Kamera halte ich alte Hamburger Häuser und Hafenansichten fest. Zu fast jeder Straße kenne ich eine kleine Geschichte – und erzähle sie gern bei einem gemeinsamen Spaziergang.',
    tone: 'sand',
  },
];

export const findPerson = (id: string | undefined): Person | undefined =>
  DEMO_PEOPLE.find((p) => p.id === id);
