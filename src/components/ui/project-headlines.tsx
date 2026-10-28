import { useState, type KeyboardEvent } from 'react';
import type { ProjectRecord } from '../../content/catalog';
import { messages } from '../../content/messages';
import { useI18n } from '../../lib/i18n';
import { brandHref } from '../../lib/unifiedRouter';
import { Icon } from '../Icon';
import './project-headlines.css';

/** Project stories use FRONTIER's headline composition, without the stacked-image transition. */
export function ProjectHeadlines({ projects }: { projects: ProjectRecord[] }) {
  const { locale } = useI18n();
  const [index, setIndex] = useState(0);
  if (!projects.length) return null;
  const current = index % projects.length;
  const active = projects[current]!;
  const next = projects[(current + 1) % projects.length]!;
  const m = messages[locale];
  const number = (value: number) => new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en', { minimumIntegerDigits: 2, useGrouping: false }).format(value);
  const change = (step: number) => setIndex(previous => (previous + step + projects.length) % projects.length);
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    change((event.key === 'ArrowRight' ? 1 : -1) * (locale === 'fa' ? -1 : 1));
  };
  const provenance = (project: ProjectRecord) => `${project.kind === 'concept' ? m.concept : m.source}${project.source?.year ? ` / ${project.source.year}` : ''}`;

  return (
    <div className="project-headlines" role="region" aria-roledescription="carousel" aria-label={m.selected} onKeyDown={keyDown}>
      <article className="ph-feature" aria-label={locale === 'fa' ? 'پروژهٔ منتخب' : 'Featured project'}>
        <div className="ph-main-body" key={active.slug} aria-live="polite" aria-atomic="true">
          <div className="ph-copy">
            <p className="ph-kicker">{active.category}</p>
            <h3 className="ph-title">{active.title}</h3>
            <p className="ph-summary">{active.summary}</p>
            <p className="ph-meta">{provenance(active)}<span aria-hidden="true"> · </span>{active.status}</p>
            <div className="ph-actions">
              <a className="ph-primary-link" href={brandHref(`/projects/${active.slug}`)}><Icon name="book" />{locale === 'fa' ? 'بررسی پروژه' : 'Explore project'}</a>
              <a className="ph-secondary-link" href={brandHref('/projects')}>{m.back}<Icon name="arrow" directional /></a>
            </div>
          </div>
          <img className="ph-image" src={active.cover} width="1000" height="750" alt="" loading="lazy" decoding="async" />
        </div>
        {projects.length > 1 && <div className="ph-controls">
          <div className="ph-pagination" role="group" aria-label={locale === 'fa' ? 'انتخاب پروژه' : 'Choose a project'}>
            {projects.map((project, at) => <button key={project.slug} type="button" aria-label={`${locale === 'fa' ? 'نمایش' : 'Show'} ${project.title}`} aria-pressed={at === current} onClick={() => setIndex(at)}><span /></button>)}
          </div>
          <div className="ph-navigation">
            <span className="ph-counter" aria-hidden="true" dir="ltr">{number(current + 1)} / {number(projects.length)}</span>
            <button type="button" aria-label={locale === 'fa' ? 'پروژهٔ قبلی' : 'Previous project'} onClick={() => change(-1)}><Icon name="arrow" back /></button>
            <button type="button" aria-label={locale === 'fa' ? 'پروژهٔ بعدی' : 'Next project'} onClick={() => change(1)}><Icon name="arrow" directional /></button>
          </div>
        </div>}
      </article>
      {projects.length > 1 && <article className="ph-next" aria-label={locale === 'fa' ? 'پروژهٔ پیشنهادی' : 'More selected work'}>
        <div className="ph-next-heading"><span className="ph-rank" aria-hidden="true">{number((current + 1) % projects.length + 1)}</span><p>{next.category}</p><img src={next.cover} width="160" height="120" alt="" loading="lazy" decoding="async" /></div>
        <h3 className="ph-next-title"><a href={brandHref(`/projects/${next.slug}`)}>{next.title}</a></h3>
        <p className="ph-next-summary">{next.summary}</p>
        <div className="ph-next-footer"><p>{provenance(next)}</p><a href={brandHref(`/projects/${next.slug}`)}>{locale === 'fa' ? 'دیدن پروژه' : 'View project'}<Icon name="arrow" directional size={17} /></a></div>
      </article>}
    </div>
  );
}
