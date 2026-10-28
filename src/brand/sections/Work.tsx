import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "../lib/content";
import { usePreferences } from "../lib/preferences";
import { SectionHeading } from "../components/SectionHeading";
import { Icon } from "../components/Icon";
function ProjectDetail({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { t, language } = usePreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (project) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="project-title"
    >
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label={t.closeStudy}
      >
        <Icon name="close" />
      </button>
      {project && (
        <>
          <div className="project-dialog-image">
            <img src={project.image} width="1200" height="900" alt="" />
          </div>
          <div className="project-dialog-copy">
            <p className="eyebrow">
              {t.concept} / {project.category[language]}
            </p>
            <h2 id="project-title">{project.title[language]}</h2>
            <div className="project-description">
              <div>
                <h3 className="eyebrow">{t.projectStatement}</h3>
                <p>{project.statement[language]}</p>
              </div>
              <dl>
                <dt>{t.projectScope}</dt>
                <dd>{project.scope[language]}</dd>
                <dt>{t.projectStatus}</dt>
                <dd>{t.projectYear}</dd>
              </dl>
            </div>
            <img
              src={project.detailImage}
              width="1200"
              height="750"
              alt={
                language === "en"
                  ? `Alternative diagram of ${project.title.en}`
                  : `نمای دیگر ${project.title.fa}`
              }
              loading="lazy"
            />
            <p className="project-disclaimer">{t.workIntro}</p>
          </div>
        </>
      )}
    </dialog>
  );
}
export function Work() {
  const { t, language } = usePreferences();
  const [filter, setFilter] = useState("all"),
    [selected, setSelected] = useState<Project | null>(null);
  return (
    <section id="work" className="section work">
      <div className="section-wrap">
        <SectionHeading
          label={t.workLabel}
          title={t.workTitle}
          body={t.workIntro}
        />
        <div className="work-filters" role="group" aria-label={t.workTitle}>
          <button
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            {t.allWork}
            <span>03</span>
          </button>
          {projects.map((p) => (
            <button
              key={p.id}
              aria-pressed={filter === p.id}
              onClick={() => setFilter(p.id)}
            >
              {p.category[language]}
            </button>
          ))}
        </div>
        <div className={`work-grid ${filter !== "all" ? "is-filtered" : ""}`}>
          {projects
            .filter((p) => filter === "all" || p.id === filter)
            .map((p, i) => (
              <article className="project-card" key={p.id} data-reveal>
                <button
                  className="project-open"
                  onClick={() => setSelected(p)}
                  title={t.openStudy}
                >
                  <div className="project-cover">
                    <img
                      src={p.image}
                      width="1200"
                      height="900"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="project-type">{t.concept}</span>
                    <span className="project-arrow">
                      <Icon name="external" size={22} />
                    </span>
                    <span className="project-index technical" dir="ltr">
                      AV—00{i + 1}
                    </span>
                  </div>
                  <span className="sr-only">{t.openStudy}: </span>
                  <div className="project-caption">
                    <h3>{p.title[language]}</h3>
                    <p>{p.category[language]}</p>
                  </div>
                </button>
              </article>
            ))}
        </div>
      </div>
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
