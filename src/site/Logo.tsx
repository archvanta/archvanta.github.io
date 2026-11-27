/**
 * ARCHVANTA mark: a folded line read as "A" + "V" (/\/) inside a site boundary, with the A's
 * crossbar as a floor line. It doubles as a folded-plate roof in elevation. Original artwork.
 */
export function Mark({ className = 'sx-mark', title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="2.2" y="2.2" width="43.6" height="43.6" />
      <path d="M8 39 L18 11 L28 39 L38 11" />
      <path d="M12.3 29 H23.7" />
      <circle cx="38" cy="11" r="2.2" fill="var(--sx-accent, #ff6a3d)" stroke="none" />
    </svg>
  );
}

/** Geometric wordmark drawn as strokes so it never depends on a web font. */
export function Wordmark({ className = 'sx-wordmark' }: { className?: string }) {
  // Each glyph sits in a 14-unit cell with 6 units of tracking (cell pitch 20).
  const g: string[] = [
    'M0 14 L6 0 L12 14 M2.6 9 H9.4', // A
    'M0 14 V0 H8 A3.6 3.6 0 0 1 8 7.2 H0 M7 7.2 L12 14', // R
    'M12 2 A7 7 0 1 0 12 12', // C
    'M0 0 V14 M12 0 V14 M0 7 H12', // H
    'M0 0 L6 14 L12 0', // V
    'M0 14 L6 0 L12 14 M2.6 9 H9.4', // A
    'M0 14 V0 L12 14 V0', // N
    'M0 0 H12 M6 0 V14', // T
    'M0 14 L6 0 L12 14 M2.6 9 H9.4', // A
  ];
  return (
    <svg
      className={className}
      viewBox="-1 -1 178 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="square"
      role="img"
      aria-label="ARCHVANTA"
    >
      {g.map((d, i) => (
        <path key={i} d={d} transform={`translate(${i * 20} 0)`} />
      ))}
    </svg>
  );
}
