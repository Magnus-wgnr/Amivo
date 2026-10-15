import { interestLabel } from '../data/catalog';
import type { InterestId, Person } from '../types';

export function commonInterests(mine: InterestId[], theirs: InterestId[]): InterestId[] {
  return theirs.filter((i) => mine.includes(i));
}

/** „A“, „A und B“, „A, B und C“ */
export function joinGerman(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}`;
}

/** Erklärt freundlich, warum zwei Personen zueinander passen könnten. */
export function matchSentence(mine: InterestId[], person: Person): string | null {
  const common = commonInterests(mine, person.interests);
  if (common.length === 0) return null;
  return `Ihr interessiert euch beide für ${joinGerman(common.map(interestLabel))}.`;
}

/** Personen sortiert nach Anzahl gemeinsamer Interessen, dann nach Entfernung */
export function rankPeople(mine: InterestId[], people: Person[]): Person[] {
  return [...people].sort((a, b) => {
    const diff = commonInterests(mine, b.interests).length - commonInterests(mine, a.interests).length;
    if (diff !== 0) return diff;
    return (a.distanceKm ?? 99) - (b.distanceKm ?? 99);
  });
}

const OPENERS: Partial<Record<InterestId, string>> = {
  spazieren: 'Hallo {name}, ich habe gesehen, dass wir beide gern spazieren gehen. Hast du Lust auf eine gemeinsame Runde?',
  garten: 'Hallo {name}, du interessierst dich auch für Gartenarbeit – was wächst denn gerade bei dir?',
  kultur: 'Hallo {name}, ich gehe auch gern ins Museum oder Theater. Hast du einen Tipp für mich?',
  kochen: 'Hallo {name}, ich koche auch gern. Was ist denn dein Lieblingsrezept?',
  musik: 'Hallo {name}, wie schön, dass du auch Musik magst! Was hörst du am liebsten?',
  radfahren: 'Hallo {name}, ich fahre auch gern Rad. Hast du Lust auf eine kleine Tour?',
  brettspiele: 'Hallo {name}, hättest du Lust, mal gemeinsam ein Brettspiel zu spielen?',
  schach: 'Hallo {name}, spielst du gern Schach? Ich würde mich über eine Partie freuen.',
  natur: 'Hallo {name}, ich bin auch gern in der Natur. Wo bist du am liebsten draußen?',
  geschichte: 'Hallo {name}, Geschichte interessiert mich auch sehr. Kennst du spannende Orte in Hamburg?',
  fotografie: 'Hallo {name}, ich fotografiere auch gern. Was fotografierst du am liebsten?',
  ausfluege: 'Hallo {name}, ich mache auch gern Ausflüge. Wohin ging dein letzter?',
};

/** Kurze Nachrichtenvorschläge, um den Einstieg leicht zu machen */
export function messageSuggestions(mine: InterestId[], person: Person): string[] {
  const common = commonInterests(mine, person.interests);
  const fromInterests = common
    .map((i) => OPENERS[i])
    .filter((t): t is string => Boolean(t))
    .map((t) => t.replace('{name}', person.firstName));
  const generic = [
    `Hallo ${person.firstName}, schön, dich hier zu entdecken! Wie geht es dir?`,
    `Hallo ${person.firstName}, hättest du Lust, dich mal auf einen Kaffee zu treffen?`,
  ];
  return [...fromInterests.slice(0, 2), ...generic].slice(0, 3);
}
