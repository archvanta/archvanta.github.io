export function Icon({
  name = "arrow",
  size = 20,
}: {
  name?:
    | "arrow"
    | "external"
    | "sun"
    | "moon"
    | "menu"
    | "close"
    | "plus"
    | "down"
    | "github";
  size?: number;
}) {
  const paths = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    external: (
      <>
        <path d="M14 4h6v6M20 4 10 14" />
        <path d="M10 4H4v16h16v-6" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20.5 14a9 9 0 0 1-10.5-10.5A9 9 0 1 0 20.5 14Z" />,
    menu: <path d="M3 8h18M3 16h18" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    plus: <path d="M12 4v16M4 12h16" />,
    down: <path d="M12 3v18m-6-6 6 6 6-6" />,
    github: (
      <>
        <path d="M8 20v-4c-4 1-4-2-6-2m14 6v-4c0-1 .3-1.6 1-2 3-.4 5-2 5-5 0-1.2-.4-2.2-1.2-3 .2-.7.2-2-.2-3-1 0-2 .5-3 1a13 13 0 0 0-7 0c-1-.5-2-1-3-1-.4 1-.4 2.3-.2 3C6.4 6.8 6 7.8 6 9c0 3 2 4.6 5 5 .7.4 1 1 1 2v4" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
