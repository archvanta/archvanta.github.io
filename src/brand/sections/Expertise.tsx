import { useState } from "react";
import { expertise } from "../lib/content";
import { usePreferences } from "../lib/preferences";
import { SectionHeading } from "../components/SectionHeading";
import { Icon } from "../components/Icon";
import { BrandGlyph } from "../../components/BrandGlyph";
function ExpertiseDiagram({ mode }: { mode: number }) {
  return <BrandGlyph mode={mode} />;
}
export function Expertise() {
  const { t, language } = usePreferences();
  const [active, setActive] = useState<string | null>("architecture");
  return (
    <section id="expertise" className="section expertise">
      <div className="section-wrap">
        <SectionHeading
          label={t.expertiseLabel}
          title={t.expertiseTitle}
          accent={t.expertiseAccent}
          body={t.expertiseIntro}
        />
        <div className="expertise-list">
          {expertise.map((e) => (
            <article
              key={e.id}
              className={`expertise-item ${active === e.id ? "is-open" : ""}`}
              data-reveal
            >
              <span className="expertise-number technical">{e.number}</span>
              <ExpertiseDiagram mode={e.mode} />
              <div className="expertise-copy">
                <h3>
                  <button
                    onClick={() => setActive(active === e.id ? null : e.id)}
                    aria-expanded={active === e.id}
                    aria-controls={`expertise-${e.id}`}
                  >
                    {e.title[language]}
                    <Icon name="plus" />
                  </button>
                </h3>
                <div id={`expertise-${e.id}`} hidden={active !== e.id}>
                  <p>{e.body[language]}</p>
                </div>
              </div>
              <p className="expertise-tags technical" dir="ltr">
                {e.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
