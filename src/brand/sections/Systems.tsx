import { useState } from "react";
import { layers } from "../lib/content";
import { usePreferences } from "../lib/preferences";
import { Icon } from "../components/Icon";
export function Systems() {
  const { t, language } = usePreferences();
  const [layer, setLayer] = useState(0);
  return (
    <section
      id="systems"
      className="section systems"
      aria-labelledby="systems-title"
    >
      <div className="section-wrap">
        <p className="eyebrow" data-reveal>
          {t.systemsLabel}
        </p>
        <div className="systems-layout">
          <div className="systems-copy" data-reveal>
            <h2 id="systems-title">
              {t.systemsTitle}
              <br />
              <span className="muted">{t.systemsAccent}</span>
            </h2>
            <p className="section-intro">{t.systemsIntro}</p>
            <div className="layer-list" role="group" aria-label={t.layerLabel}>
              {layers.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setLayer(i)}
                  aria-pressed={layer === i}
                  aria-controls="layer-description"
                >
                  <span className="technical" dir="ltr">
                    0{i + 1}
                  </span>
                  {item.title[language]}
                  <Icon name="arrow" size={17} />
                </button>
              ))}
            </div>
          </div>
          <div className="systems-visual">
            <span className="technical systems-visual-label" dir="ltr">
              SYSTEM STUDY / 0{layer + 1}
            </span>
            <div className="generated-system-stage" data-layer={layer}>
              {['space', 'structure', 'infrastructure', 'information'].map((name, at) => <img key={name} src={`/images/brand-art/system-${name}.webp`} width="960" height="960" alt={at === layer ? layers[at]!.title[language] : ''} aria-hidden={at !== layer} data-active={at === layer} loading="lazy" decoding="async" />)}
              <span className="generated-system-orbit" aria-hidden="true" />
            </div>
            <p className="generated-system-note">{language === 'fa' ? 'تجسم مفهومی؛ بخشی از نقشه‌های پروژه نیست.' : 'Concept visualization; not a project drawing.'}</p>
            <div
              id="layer-description"
              className="layer-description"
              aria-live="polite"
            >
              <span className="technical" dir="ltr">
                0{layer + 1} / 04
              </span>
              <p>{layers[layer]?.body[language]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
