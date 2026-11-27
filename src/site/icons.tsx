/** ARCHVANTA outline icon family: 24-unit grid, 1.5 stroke, square caps, drafting-instrument motifs. */
import type { SVGProps } from 'react';

const paths = {
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  fit: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  expand: <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>
  ),
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  layers: <path d="m12 3 9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  ink: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor" stroke="none" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function I({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

/**
 * Discipline pictograms (52px): drawn like plan/section symbols. `.sx-hl` strokes take the accent on hover.
 */
export function Discipline({ kind }: { kind: 'architecture' | 'technical' | 'bim' | 'digital' }) {
  const common = { className: 'sx-ico', viewBox: '0 0 52 52', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true } as const;
  switch (kind) {
    case 'architecture': // plan with a door swing and a north point
      return (
        <svg {...common}>
          <path d="M6 10h40v34H6zM6 26h16M30 26h16M26 10v12" />
          <path className="sx-hl" d="M22 26a8 8 0 0 1 8-8" strokeDasharray="2 2" />
          <path className="sx-hl" d="M22 26V18" />
          <circle cx="40" cy="18" r="3.5" />
          <path d="M40 13.5v-2" />
        </svg>
      );
    case 'technical': // grid of equipment bays with clearance zone, no specific project
      return (
        <svg {...common}>
          <path d="M6 8h40v36H6z" />
          <path d="M12 14h10v24H12zM30 14h10v24H30z" />
          <path className="sx-hl" d="M22 14h8M22 38h8" strokeDasharray="2 2" />
          <path className="sx-hl" d="M26 18v16M24 20l2-2 2 2M24 32l2 2 2-2" />
        </svg>
      );
    case 'bim': // axonometric cube with layers peeled
      return (
        <svg {...common}>
          <path d="M26 6 44 16v20L26 46 8 36V16z" />
          <path d="M8 16l18 10 18-10M26 26v20" />
          <path className="sx-hl" d="M8 24l18 10 18-10" strokeDasharray="2 2" />
        </svg>
      );
    case 'digital': // window with live signal
      return (
        <svg {...common}>
          <path d="M5 9h42v32H5zM5 16h42" />
          <circle cx="10" cy="12.5" r="1" />
          <circle cx="14" cy="12.5" r="1" />
          <path className="sx-hl" d="M10 32l7-8 6 5 7-10 6 6 6-4" />
        </svg>
      );
  }
}
