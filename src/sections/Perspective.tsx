import { usePreferences } from "../lib/preferences";
export function Perspective() {
  const { t } = usePreferences();
  return (
    <section
      id="perspective"
      className="perspective section"
      aria-labelledby="perspective-title"
    >
      <div className="section-wrap">
        <p className="eyebrow" data-reveal>
          {t.manifestoLabel}
        </p>
        <div className="perspective-grid">
          <div className="perspective-art" aria-hidden="true">
            <svg viewBox="0 0 300 300" fill="none">
              <path d="M30 260 150 30l120 230H30Z" stroke="currentColor" />
              <path
                d="m65 230 85-160 85 160H65Zm35-30 50-91 50 91H100Z"
                stroke="currentColor"
              />
              <path
                d="M150 0v300M0 260h300M30 260 250 60M270 260 50 60"
                stroke="currentColor"
                strokeDasharray="2 6"
                opacity=".45"
              />
              <circle cx="150" cy="154" r="5" fill="var(--accent)" />
            </svg>
            <span className="technical" dir="ltr">
              A SHIFT IN PERSPECTIVE
            </span>
          </div>
          <div data-reveal>
            <h2 id="perspective-title">
              {t.manifestoTitle}
              <br />
              <span className="muted">{t.manifestoAccent}</span>
            </h2>
            <p className="manifesto-body">{t.manifestoBody}</p>
            <p className="section-intro manifesto-foot">{t.manifestoFoot}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
