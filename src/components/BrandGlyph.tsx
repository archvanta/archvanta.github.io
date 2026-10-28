export function BrandGlyph({ mode }: { mode: number }) {
  const asset = mode === 0 ? 'architecture' : mode === 2 ? 'bim' : mode === 3 ? 'data-centers' : 'digital-lab';
  return <img className="brand-glyph expertise-diagram" src={`/images/brand-art/${asset}.webp`} alt="" width="384" height="384" loading="lazy" decoding="async" aria-hidden="true" />;
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
