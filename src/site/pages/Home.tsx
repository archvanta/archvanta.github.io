import { useRef, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { brandHref } from '../../lib/unifiedRouter';
import { tr } from '../../content/portfolio';
import { copy, pendingProject, person, pick, practice, projects, sheets, ventures } from '../content';
import { Discipline, I } from '../icons';
import { Mark } from '../Logo';
import { PlanViewer } from '../PlanViewer';
import { Arrow, ContactCta, SecHead, useScrollReveal } from '../shared';

function Hero() {
  const { locale } = useI18n();
  const h = copy.hero;
  const tb = copy.titleblock;
  const lead = projects()[0];
  const cover = lead?.cover?.src ?? '/work-media/images/v43.webp';
  return (
    <section className="sx-hero" aria-labelledby="sx-hero-title">
      <div className="sx-wrap">
        <div className="sx-hero-head">
          <h1 id="sx-hero-title">
            <span className="sx-line"><span>{pick(h.l1, locale)}</span></span>
            <span className="sx-line">
              <span>
                {pick(h.l2a, locale)}
                <span className="sx-serif sx-accent">{pick(h.l2b, locale)}</span>
              </span>
            </span>
          </h1>
          <div className="sx-hero-aside">
            <p>{pick(h.body, locale)}</p>
            <div className="sx-hero-actions">
              <a className="sx-btn sx-btn--solid" href={brandHref('/work')}>
                {pick(h.ctaWork, locale)} <Arrow />
              </a>
              <a className="sx-btn" href={brandHref('/drawings')}>{pick(h.ctaDrawings, locale)}</a>
            </div>
          </div>
        </div>
        <div className="sx-sheet">
          <a className="sx-sheet-media" href={lead ? brandHref(`/work/${lead.slug}`) : brandHref('/work')}>
            <img src={cover} alt="" width="1500" height="766" fetchPriority="high" decoding="async" />
            <svg className="sx-axes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line className="sx-draw" x1="20" y1="0" x2="20" y2="100" />
              <line className="sx-draw" x1="50" y1="0" x2="50" y2="100" />
              <line className="sx-draw" x1="80" y1="0" x2="80" y2="100" />
              <line className="sx-draw" x1="0" y1="34" x2="100" y2="34" />
              <line className="sx-draw" x1="0" y1="72" x2="100" y2="72" />
            </svg>
            {['A', 'B', 'C'].map((c, i) => (
              <span key={c} className="sx-bubble" style={{ insetInlineStart: `calc(${[20, 50, 80][i]}% - 13px)`, insetBlockStart: 10 }} aria-hidden="true">{c}</span>
            ))}
            {['1', '2'].map((c, i) => (
              <span key={c} className="sx-bubble" style={{ insetInlineStart: 10, insetBlockStart: `calc(${[34, 72][i]}% - 13px)` }} aria-hidden="true">{c}</span>
            ))}
            <span className="sx-sheet-caption">{pick(h.caption, locale)}</span>
          </a>
          <dl className="sx-titleblock">
            <div><dt>{pick(tb.project, locale)}</dt><dd>ARCHVANTA</dd></div>
            <div><dt>{pick(tb.drawn, locale)}</dt><dd className="sx-fa-ok">{pick(person.name, locale)}</dd></div>
            <div><dt>{pick(tb.location, locale)}</dt><dd className="sx-fa-ok">{pick(person.city, locale)} · 35.69°N</dd></div>
            <div><dt>{pick(tb.status, locale)}</dt><dd className="sx-fa-ok"><span className="sx-status">{pick(tb.available, locale)}</span></dd></div>
            <div><dt>{pick(tb.sheet, locale)}</dt><dd>A-000 · 1:1</dd></div>
            <div><dt>{pick(tb.rev, locale)}</dt><dd>2026.11</dd></div>
            <div className="sx-tb-logo"><dt className="sx-visually-hidden">ARCHVANTA</dt><dd><Mark className="" /></dd></div>
          </dl>
        </div>
      </div>
      <div className="sx-ticker" aria-hidden="true">
        <div className="sx-ticker-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {copy.ticker[locale].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  const { locale } = useI18n();
  const w = copy.work;
  const list = projects();
  const float = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<string | null>(null);
  const move = (e: React.PointerEvent) => {
    const el = float.current;
    if (el) el.style.translate = `${e.clientX}px ${e.clientY}px`;
  };
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-work">
      <SecHead
        id="sx-work"
        label={w.label}
        title={w.title}
        action={
          <a className="sx-link" href={brandHref('/work')}>
            {pick(w.all, locale)} <Arrow />
          </a>
        }
      />
      <ol className="sx-index" onPointerMove={move} onPointerLeave={() => setImg(null)}>
        {list.map((p, i) => (
          <li key={p.slug} className="sx-reveal">
            <a href={brandHref(`/work/${p.slug}`)} onPointerEnter={() => setImg(p.cover?.src ?? null)} onFocus={() => setImg(null)}>
              <span className="sx-index-thumb" aria-hidden="true"><img src={p.cover?.src} alt="" loading="lazy" decoding="async" /></span>
              <span className="sx-mono sx-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{tr(p.title, locale)}</h3>
              <span className="sx-index-meta">{tr(p.type ?? p.category, locale)}</span>
              <span className="sx-mono sx-year">{p.year}</span>
              <span className="sx-arrow" aria-hidden="true"><Arrow /></span>
            </a>
          </li>
        ))}
        <li className="sx-reveal">
          <div className="sx-index-row sx-pending" aria-disabled="true">
            <span className="sx-mono sx-n">{String(list.length + 1).padStart(2, '0')}</span>
            <h3>{pick(pendingProject.title, locale)}</h3>
            <span className="sx-index-meta">{pick(w.pending, locale)}</span>
            <span className="sx-mono sx-year">{pendingProject.year}</span>
            <span className="sx-arrow" aria-hidden="true"><I name="lock" size={14} /></span>
          </div>
        </li>
      </ol>
      <div ref={float} className={`sx-float${img ? ' is-on' : ''}`} aria-hidden="true" style={{ translate: '-999px -999px' }}>
        {img && <img src={img} alt="" />}
      </div>
    </section>
  );
}

function DrawingRoom() {
  const { locale } = useI18n();
  const d = copy.drawings;
  const set = sheets().filter((s) => s.kind.en !== 'Board').slice(0, 8);
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-drawings">
      <SecHead
        id="sx-drawings"
        label={d.label}
        title={d.title}
        action={
          <a className="sx-link" href={brandHref('/drawings')}>
            {pick(d.open, locale)} <Arrow />
          </a>
        }
      />
      <p className="sx-lede sx-reveal" style={{ marginBlockEnd: 32, maxInlineSize: '44ch', fontSize: 'clamp(17px,1.6vw,21px)', color: 'var(--sx-ink-2)' }}>{pick(d.intro, locale)}</p>
      <div className="sx-reveal">
        <PlanViewer sheets={set} initial="v35" compact />
      </div>
    </section>
  );
}

function Practice() {
  const { locale } = useI18n();
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-practice">
      <SecHead id="sx-practice" label={copy.practice.label} title={copy.practice.title} />
      <div className="sx-practice">
        {practice.map((p, i) => (
          <article key={p.kind} className="sx-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            <span className="sx-mono">{String(i + 1).padStart(2, '0')}</span>
            <Discipline kind={p.kind} />
            <h3>{pick(p.title, locale)}</h3>
            <p>{pick(p.body, locale)}</p>
            {'confidential' in p && p.confidential && (
              <p className="sx-confidential"><I name="lock" /> {pick(p.confidential, locale)}</p>
            )}
            <ul>{p.tags.map((t) => <li key={t} className="sx-tag">{t}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function VentureCards() {
  const { locale } = useI18n();
  const v = copy.ventures;
  const [lead, ...rest] = ventures;
  if (!lead) return null;
  return (
    <div className="sx-ventures">
      <a className="sx-venture sx-venture--lead sx-reveal" href={brandHref('/ventures/frontier')}>
        <div className="sx-venture-media"><img src={lead.image} alt={`${lead.name} — screenshot`} loading="lazy" decoding="async" /></div>
        <div className="sx-venture-body">
          <div className="sx-venture-top">
            <span className="sx-mono sx-fa-ok">{pick(lead.kind, locale)}</span>
            <span className="sx-mono sx-live">{pick(v.live, locale)}</span>
          </div>
          <h3>{lead.name}</h3>
          <p>{pick(lead.body, locale)}</p>
          <span className="sx-link">{pick(v.read, locale)} <Arrow /></span>
        </div>
      </a>
      {rest.map((x) => (
        <a key={x.slug} className="sx-venture sx-reveal" href={x.url} target="_blank" rel="noopener noreferrer">
          <div className="sx-venture-top">
            <span className="sx-mono sx-fa-ok">{pick(x.kind, locale)}</span>
            <I name="arrowUpRight" size={18} />
          </div>
          <h3>{x.name}</h3>
          <p>{pick(x.body, locale)}</p>
        </a>
      ))}
    </div>
  );
}

function Ventures() {
  const { locale } = useI18n();
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-ventures">
      <SecHead
        id="sx-ventures"
        label={copy.ventures.label}
        title={copy.ventures.title}
        action={<a className="sx-link" href={brandHref('/ventures')}>{pick(copy.ventures.open, locale)} <Arrow /></a>}
      />
      <VentureCards />
    </section>
  );
}

function AboutTeaser() {
  const { locale } = useI18n();
  const a = copy.about;
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-about">
      <SecHead id="sx-about" label={a.label} title={a.title} />
      <div className="sx-about">
        <figure className="sx-portrait sx-reveal">
          <img src={person.portrait} alt={pick(person.name, locale)} loading="lazy" decoding="async" width="791" height="798" />
          <figcaption><span>{pick(person.short, locale)}</span><span>{pick(person.city, locale)}</span></figcaption>
        </figure>
        <div className="sx-about-body sx-reveal">
          <p className="sx-lede">{pick(a.lede, locale)}</p>
          <p>{pick(copy.hero.body, locale)}</p>
          <div><a className="sx-btn" href={brandHref('/about')}>{pick(a.more, locale)} <Arrow /></a></div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { locale } = useI18n();
  useScrollReveal(locale);
  return (
    <>
      <Hero />
      <SelectedWork />
      <DrawingRoom />
      <Practice />
      <Ventures />
      <AboutTeaser />
      <ContactCta />
    </>
  );
}
