/** A flat, monochrome family: portal, coordinated layers, racks and digital tools. */
export function BrandGlyph({ mode, className = '' }: { mode: number; className?: string }) {
  return <svg className={`brand-glyph ${className}`} viewBox="0 0 48 48" width="48" height="48" fill="currentColor" aria-hidden="true" focusable="false">
    {mode === 0 ? <path d="M9 7h30v34H29V17H19v24H9V7Z" />
      : mode === 2 ? <><path opacity=".4" d="M7 7h26v26H7V7Zm7 7v12h12V14H14Z" fillRule="evenodd" /><path d="M15 15h26v26H15V15Zm7 7v12h12V22H22Z" fillRule="evenodd" /></>
      : mode === 3 ? <path d="M7 8h15v32H7V8Zm4 7v3h7v-3h-7Zm0 8v3h7v-3h-7Zm15-15h15v32H26V8Zm4 7v3h7v-3h-7Zm0 8v3h7v-3h-7Z" fillRule="evenodd" />
      : <><path d="M7 7h12v5h-7v7H7V7Zm22 0h12v12h-5v-7h-7V7ZM7 29h5v7h7v5H7V29Zm29 0h5v12H29v-5h7v-7Z" opacity=".5" /><path d="m24 15 9 9-9 9-9-9 9-9Z" /></>}
  </svg>;
}

export function PerspectiveMark() {
  return (
    <div className="perspective-mark" aria-hidden="true">
      <svg viewBox="0 0 300 300" fill="none">
        <path d="M30 260 150 30l120 230H30Z" />
        <path d="m65 230 85-160 85 160H65Zm35-30 50-91 50 91H100Z" />
        <path d="M150 0v300M0 260h300M30 260 250 60M270 260 50 60" strokeDasharray="2 6" opacity=".45" />
        <circle cx="150" cy="154" r="5" className="perspective-mark-dot" />
      </svg>
      <span dir="ltr">A SHIFT IN PERSPECTIVE</span>
    </div>
  );
}
