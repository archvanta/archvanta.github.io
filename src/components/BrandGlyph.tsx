export function BrandGlyph({ mode }: { mode: number }) {
  return (
    <svg viewBox="0 0 130 100" fill="none" aria-hidden="true" className="brand-glyph expertise-diagram">
      {mode === 0 ? (
        <>
          <path d="m20 65 45 24 45-24V34L65 10 20 34v31Z" />
          <path d="m20 34 45 24 45-24M65 58v31M44 47V22m42 25V22" />
        </>
      ) : mode === 2 ? (
        <>
          {[0, 1, 2].map((index) => <path key={index} d={`m20 ${30 + index * 20} 45-22 45 22-45 22-45-22Z`} />)}
          <path d="M65 8v84" strokeDasharray="2 5" />
        </>
      ) : mode === 3 ? (
        <>
          {[0, 1, 2].map((index) => (
            <g key={index} transform={`translate(${index * 29},${index * -8})`}>
              <path d="m20 35 24 11v42L20 77V35Zm0 0 17-9 24 11-17 9m0 42 17-9V37" />
              <path d="m25 45 13 6m-13 5 13 6m-13 5 13 6" />
            </g>
          ))}
        </>
      ) : (
        <>
          {Array.from({ length: 7 }, (_, index) => (
            <path key={index} d={`M${15 + index * 10} 80Q${65 + index * 5} ${5 + index * 8} 115 ${20 + index * 10}`} />
          ))}
          <path d="M15 80h100" />
        </>
      )}
    </svg>
  );
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
