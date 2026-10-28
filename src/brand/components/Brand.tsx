export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 40 21 8h6l15 32H31L24 23 17 40H6Z"
        stroke="currentColor"
        strokeWidth="2.3"
      />
      <path
        d="m21 8 6-4 16 32-1 4M27 4l16 32M17 40l6-4 4-9M31 40l6-4"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M19 32h10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#home"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="ARCHVANTA — Home"
    >
      <BrandMark />
      <span>ARCHVANTA</span>
    </a>
  );
}
