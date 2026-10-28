import { BrandMark } from "../components/Brand";
import { usePreferences } from "../lib/preferences";
export function About() {
  const { t } = usePreferences();
  return (
    <section id="about" className="section about">
      <div className="section-wrap">
        <p className="eyebrow" data-reveal>
          {t.aboutLabel}
        </p>
        <div className="about-layout">
          <div className="about-symbol" aria-hidden="true">
            <BrandMark />
            <span className="technical" dir="ltr">
              ARCH / VANTA
              <br />
              STRUCTURE / PERSPECTIVE
            </span>
          </div>
          <div className="about-copy" data-reveal>
            <h2>
              {t.aboutTitle}
              <br />
              <span className="muted">{t.aboutAccent}</span>
            </h2>
            <p className="about-lead">{t.aboutBody}</p>
            <p className="section-intro">{t.aboutSecond}</p>
            <p className="eyebrow about-foot">{t.aboutFoot}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
