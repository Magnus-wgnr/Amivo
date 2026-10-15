import type { EventArtKey } from '../types';

// Ruhige, flächige Illustrationen in den Markenfarben – ohne Fremdbilder.

const BG: Record<EventArtKey, string> = {
  alster: '#D9EEF0',
  kaffee: '#F3E6D6',
  spiele: '#E9E5FA',
  museum: '#EDE7DC',
  gruen: '#DDF3E8',
  chor: '#ECE8FA',
  rad: '#DCEFEA',
};

function Scene({ art }: { art: EventArtKey }) {
  switch (art) {
    case 'alster':
      return (
        <>
          <circle cx="250" cy="48" r="22" fill="#FFD27A" />
          <path d="M0 110 Q 80 70 160 110 T 320 110 V160 H0Z" fill="#0F4C5C" opacity=".15" />
          <path d="M40 112 Q 160 40 280 112" stroke="#0F4C5C" strokeWidth="8" fill="none" strokeLinecap="round" />
          {[70, 110, 150, 190, 230].map((x) => (
            <line key={x} x1={x} y1={x === 150 ? 76 : 90} x2={x} y2="112" stroke="#0F4C5C" strokeWidth="4" />
          ))}
          <path d="M0 125 Q 40 117 80 125 T 160 125 T 240 125 T 320 125 V160 H0Z" fill="#7ADCB6" opacity=".7" />
          <path d="M20 140 h40 M120 146 h50 M220 138 h44" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'kaffee':
      return (
        <>
          <ellipse cx="160" cy="132" rx="80" ry="12" fill="#0F4C5C" opacity=".12" />
          <rect x="112" y="70" width="84" height="60" rx="16" fill="#0F4C5C" />
          <path d="M196 84 h12 a14 14 0 0 1 0 28 h-12" stroke="#0F4C5C" strokeWidth="8" fill="none" />
          <rect x="112" y="70" width="84" height="14" rx="7" fill="#7ADCB6" />
          {[134, 154, 174].map((x) => (
            <path key={x} d={`M${x} 58 q -8 -12 0 -24 q 8 -12 0 -24`} stroke="#B7AEF0" strokeWidth="5" fill="none" strokeLinecap="round" />
          ))}
          <circle cx="56" cy="50" r="10" fill="#7ADCB6" opacity=".6" />
          <circle cx="268" cy="110" r="14" fill="#B7AEF0" opacity=".6" />
        </>
      );
    case 'spiele':
      return (
        <>
          <rect x="70" y="56" width="64" height="64" rx="14" fill="#fff" stroke="#0F4C5C" strokeWidth="5" transform="rotate(-10 102 88)" />
          {[
            [88, 72],
            [116, 70],
            [102, 88],
            [90, 104],
            [118, 102],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#0F4C5C" transform="rotate(-10 102 88)" />
          ))}
          <rect x="170" y="44" width="56" height="78" rx="10" fill="#7C6FD6" transform="rotate(8 198 83)" />
          <rect x="196" y="50" width="56" height="78" rx="10" fill="#fff" stroke="#0F4C5C" strokeWidth="4" transform="rotate(16 224 89)" />
          <path d="M224 78 l8 12 -8 12 -8 -12z" fill="#7ADCB6" transform="rotate(16 224 89)" />
          <circle cx="40" cy="40" r="8" fill="#7ADCB6" />
        </>
      );
    case 'museum':
      return (
        <>
          <path d="M100 62 L160 30 L220 62Z" fill="#0F4C5C" />
          <rect x="100" y="62" width="120" height="10" fill="#0F4C5C" />
          {[112, 140, 168, 196].map((x) => (
            <rect key={x} x={x} y="76" width="12" height="46" rx="3" fill="#0F4C5C" opacity=".85" />
          ))}
          <rect x="92" y="122" width="136" height="12" rx="3" fill="#0F4C5C" />
          <circle cx="160" cy="48" r="6" fill="#FFD27A" />
          <rect x="30" y="60" width="40" height="52" rx="4" fill="#fff" stroke="#7C6FD6" strokeWidth="4" />
          <path d="M36 102 l12 -16 8 10 6 -6 6 12z" fill="#7ADCB6" />
          <rect x="250" y="56" width="44" height="56" rx="4" fill="#fff" stroke="#7C6FD6" strokeWidth="4" />
          <circle cx="272" cy="84" r="12" fill="#B7AEF0" />
        </>
      );
    case 'gruen':
      return (
        <>
          <circle cx="70" cy="44" r="18" fill="#FFD27A" />
          <path d="M0 120 Q 90 60 180 112 T 320 96 V160 H0Z" fill="#7ADCB6" />
          <path d="M0 136 Q 110 100 200 132 T 320 124 V160 H0Z" fill="#0F4C5C" opacity=".85" />
          {[
            [210, 92],
            [240, 86],
            [270, 92],
          ].map(([x, y]) => (
            <g key={x}>
              <rect x={x - 3} y={y} width="6" height="22" fill="#0A3540" />
              <circle cx={x} cy={y - 6} r="16" fill="#1F7A5A" />
            </g>
          ))}
          <path d="M120 140 q 30 -10 60 -4" stroke="#FAF6EF" strokeWidth="4" strokeDasharray="8 8" fill="none" />
        </>
      );
    case 'chor':
      return (
        <>
          <path d="M70 110 V50 l60 -12 V98" stroke="#0F4C5C" strokeWidth="6" fill="none" strokeLinejoin="round" />
          <ellipse cx="58" cy="112" rx="16" ry="12" fill="#0F4C5C" />
          <ellipse cx="118" cy="100" rx="16" ry="12" fill="#0F4C5C" />
          <path d="M200 116 V64" stroke="#7C6FD6" strokeWidth="6" />
          <path d="M200 64 q 22 6 26 26" stroke="#7C6FD6" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="188" cy="118" rx="15" ry="11" fill="#7C6FD6" />
          <circle cx="262" cy="52" r="12" fill="#7ADCB6" />
          <circle cx="160" cy="40" r="7" fill="#7ADCB6" opacity=".7" />
        </>
      );
    case 'rad':
      return (
        <>
          <path d="M0 132 Q 80 120 160 132 T 320 132 V160 H0Z" fill="#0F4C5C" opacity=".15" />
          <circle cx="110" cy="102" r="28" stroke="#0F4C5C" strokeWidth="6" fill="none" />
          <circle cx="210" cy="102" r="28" stroke="#0F4C5C" strokeWidth="6" fill="none" />
          <path d="M110 102 L145 62 H190 L210 102 M145 62 L160 102 H110 M190 62 L160 102" stroke="#1F7A5A" strokeWidth="6" fill="none" strokeLinejoin="round" />
          <path d="M138 54 h18" stroke="#0F4C5C" strokeWidth="6" strokeLinecap="round" />
          <path d="M184 52 l8 10" stroke="#0F4C5C" strokeWidth="6" strokeLinecap="round" />
          <circle cx="268" cy="40" r="16" fill="#FFD27A" />
        </>
      );
  }
}

export function EventArt({ art, height = 140 }: { art: EventArtKey; height?: number }) {
  return (
    <svg
      className="event-art"
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid slice"
      style={{ height, background: BG[art] }}
      aria-hidden="true"
      focusable="false"
    >
      <Scene art={art} />
    </svg>
  );
}
