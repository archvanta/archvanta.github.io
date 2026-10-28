import { site } from "../lib/content";
import { usePreferences } from "../lib/preferences";
import { Icon } from "../components/Icon";
import { SectionHeading } from "../components/SectionHeading";
export function Lab() {
  const { t } = usePreferences();
  return (
    <section id="lab" className="section lab">
      <div className="section-wrap">
        <SectionHeading
          label={t.labLabel}
          title={t.labTitle}
          body={t.labBody}
        />
        <article className="frontier-feature" data-reveal>
          <div className="frontier-info">
            <p className="eyebrow">
              <i className="status-dot" />
              {t.live}
            </p>
            <h3 lang="en" dir="ltr">
              FRONTIER
              <span>
                <Icon name="external" size={28} />
              </span>
            </h3>
            <p>{t.frontierBody}</p>
            <a
              href={site.frontier}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-solid"
            >
              {t.frontierLink}
              <Icon name="external" size={18} />
              <span className="sr-only">{t.external}</span>
            </a>
            <p className="technical frontier-meta">{t.frontierMeta}</p>
          </div>
          <figure className="frontier-preview">
            <div className="browser-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
              <p dir="ltr">archvanta.github.io/frontier</p>
            </div>
            <a
              href={site.frontier}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.frontierLink} — ${t.external}`}
            >
              <img
                src="/images/frontier-live.webp"
                alt={t.imageAlt}
                width="1440"
                height="1000"
                loading="lazy"
                decoding="async"
              />
            </a>
            <figcaption>{t.authenticPreview}</figcaption>
          </figure>
        </article>
        <div className="lab-next" data-reveal>
          <span className="lab-next-mark" aria-hidden="true">
            <Icon name="plus" size={30} />
          </span>
          <div>
            <h3>{t.futureLab}</h3>
            <p>{t.futureLabBody}</p>
          </div>
          <span className="technical" dir="ltr">
            LAB / OPEN ENDED
          </span>
        </div>
      </div>
    </section>
  );
}
