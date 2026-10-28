import { useState } from "react";
import { ArchitecturalModel } from "../components/ArchitecturalModel";
import { Icon } from "../components/Icon";
import { usePreferences } from "../lib/preferences";
export function Hero() {
  const { t } = usePreferences();
  const [mode, setMode] = useState(0);
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">
          <i className="status-dot" />
          {t.perspective}
        </span>
        <span className="technical" dir="ltr">
          EST. IN PERSPECTIVE / 001
        </span>
      </div>
      <div className="hero-visual">
        <ArchitecturalModel mode={mode} interactive />
        <span className="visual-coordinate technical" dir="ltr">
          A / V — 45.00°
        </span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow hero-discipline">{t.disciplines}</p>
        <h1 id="hero-title">
          {t.hero1}
          <br />
          <span className="muted">
            {t.hero2}
            <br />
            {t.hero3}
          </span>
        </h1>
        <p className="hero-description">{t.heroBody}</p>
        <div className="hero-actions">
          <a href="#work" className="button button-solid">
            {t.explore}
            <Icon name="arrow" />
          </a>
          <a href="#about" className="text-link">
            {t.discover}
            <Icon name="external" size={16} />
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#perspective" className="scroll-link">
          <span className="scroll-circle">
            <Icon name="down" size={17} />
          </span>
          <span className="eyebrow">{t.scroll}</span>
        </a>
        <div className="model-controls">
          <p className="technical" dir="ltr">
            {t.modelLabel}
            <span> / 0{mode + 1}</span>
          </p>
          <div className="mode-switch" role="group" aria-label={t.modelLabel}>
            {t.modelModes.map((label, i) => (
              <button
                key={i}
                aria-pressed={mode === i}
                onClick={() => setMode(i)}
              >
                <small dir="ltr">0{i + 1}</small>
                {label}
              </button>
            ))}
          </div>
          <p className="model-note">{t.modelNote}</p>
        </div>
      </div>
      <p className="sr-only">{t.modelAccessible}</p>
    </section>
  );
}
