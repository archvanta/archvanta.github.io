import { useState } from "react";
import { expertise } from "../lib/content";
import { usePreferences } from "../lib/preferences";
import { SectionHeading } from "../components/SectionHeading";
import { Icon } from "../components/Icon";
function ExpertiseDiagram({ mode }: { mode: number }) {
  return (
    <svg
      viewBox="0 0 130 100"
      fill="none"
      aria-hidden="true"
      className="expertise-diagram"
    >
      {mode === 0 ? (
        <>
          <path d="m20 65 45 24 45-24V34L65 10 20 34v31Z" />
          <path d="m20 34 45 24 45-24M65 58v31M44 47V22m42 25V22" />
        </>
      ) : mode === 2 ? (
        <>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`m20 ${30 + i * 20} 45-22 45 22-45 22-45-22Z`} />
          ))}
          <path d="M65 8v84" strokeDasharray="2 5" />
        </>
      ) : mode === 3 ? (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${i * 29},${i * -8})`}>
              <path d="m20 35 24 11v42L20 77V35Zm0 0 17-9 24 11-17 9m0 42 17-9V37" />
              <path d="m25 45 13 6m-13 5 13 6m-13 5 13 6" />
            </g>
          ))}
        </>
      ) : (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              d={`M${15 + i * 10} 80Q${65 + i * 5} ${5 + i * 8} 115 ${20 + i * 10}`}
            />
          ))}
          <path d="M15 80h100" />
        </>
      )}
    </svg>
  );
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
