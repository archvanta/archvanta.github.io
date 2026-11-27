import { useI18n } from '../../lib/i18n';
import { brandHref } from '../../lib/unifiedRouter';
import { copy, person, pick, practice, projects, sheets, ventures } from '../content';
import { Discipline, I } from '../icons';
import { Mark } from '../Logo';
import { Arrow, ContactCta, SecHead, useScrollReveal } from '../shared';

/** Original line drawing for the hero: a folded-plate roof study built from the logo's A/V fold. Not a project. */
function HeroDrawing() {
  const peaks = Array.from({ length: 11 }, (_, i) => 150 + i * 90);
  const roof = peaks.map((x, i) => `${i ? 'L' : 'M'}${x} ${i % 2 ? 300 : 210}`).join(' ');
  const valleys = peaks.filter((_, i) => i % 2);
  return (
    <svg className="sx-hd" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g className="sx-hd-ink">
        <path pathLength={1} d="M60 520 H1140" />
        <path pathLength={1} d={roof} />
        <path pathLength={1} d="M150 210 V520 M1050 300 V520" />
        {valleys.map((x) => (
          <path key={x} pathLength={1} d={`M${x} 300 V520`} />
        ))}
        <path pathLength={1} d="M150 470 H1050 M150 380 H1050" className="sx-hd-thin" />
        {peaks.slice(0, -1).map((x) => (
          <path key={x} pathLength={1} d={`M${x + 45} 380 V520`} className="sx-hd-thin" />
        ))}
        <path pathLength={1} d="M150 140 H1050 M150 128 V152 M1050 128 V152" className="sx-hd-thin" />
        <path pathLength={1} d="M90 560 H330 M90 552 V568 M150 556 V564 M210 556 V564 M270 556 V564 M330 552 V568" className="sx-hd-thin" />
        <circle cx="1110" cy="90" r="22" pathLength={1} className="sx-hd-thin" />
        <path pathLength={1} d="M1110 62 L1118 90 L1110 84 L1102 90 Z" className="sx-hd-thin" />
        <path pathLength={1} d="M60 60 L600 210" className="sx-hd-sun" />
      </g>
      <circle cx="600" cy="210" r="7" className="sx-hd-dot" />
      <text x="600" y="124" textAnchor="middle" className="sx-hd-text">36.00</text>
      <text x="90" y="590" className="sx-hd-text">0 · 2 · 4 · 6 m</text>
      <text x="1110" y="132" textAnchor="middle" className="sx-hd-text">N</text>
    </svg>
  );
}

function Hero() {
  const { locale } = useI18n();
  const h = copy.hero;
  const tb = copy.titleblock;
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
              <button type="button" className="sx-btn sx-btn--solid" onClick={() => document.getElementById('sx-map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                {pick(h.ctaExplore, locale)} <Arrow />
              </button>
              <a className="sx-btn" href={brandHref('/about')}>{pick(h.ctaAbout, locale)}</a>
            </div>
          </div>
        </div>
        <div className="sx-sheet">
          <div className="sx-sheet-media sx-sheet-media--drawing sx-grid-bg">
            <HeroDrawing />
            <span className="sx-sheet-caption">{pick(h.drawing, locale)}</span>
          </div>
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

/** Index of the site's sections: text only, no project imagery on the home page. */
function SiteMap() {
  const { locale } = useI18n();
  const m = copy.home;
  const counts: Record<string, string> = {
    work: locale === 'fa' ? `${projects().length.toLocaleString('fa-IR')} پروژه` : `${projects().length} projects`,
    drawings: locale === 'fa' ? `${sheets().length.toLocaleString('fa-IR')} شیت` : `${sheets().length} sheets`,
    about: locale === 'fa' ? 'رزومه' : 'CV',
    ventures: locale === 'fa' ? `${ventures.length.toLocaleString('fa-IR')} محصول` : `${ventures.length} products`,
    frontier: locale === 'fa' ? 'زنده' : 'Live',
    contact: locale === 'fa' ? 'ایمیل' : 'Email',
  };
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-map" id="sx-map-section">
      <SecHead id="sx-map" label={m.mapLabel} title={m.mapTitle} />
      <p className="sx-lede sx-reveal" style={{ marginBlockEnd: 24, maxInlineSize: '48ch', fontSize: 'clamp(17px,1.6vw,21px)', color: 'var(--sx-ink-2)' }}>{pick(m.mapIntro, locale)}</p>
      <ol className="sx-index sx-index--map" data-testid="site-map">
        {m.sections.map((x, i) => (
          <li key={x.key} className="sx-reveal">
            <a href={x.href.startsWith('#') ? x.href : brandHref(x.href)}>
              <span className="sx-mono sx-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{pick(x.title, locale)}</h3>
              <span className="sx-index-meta">{pick(x.body, locale)}</span>
              <span className="sx-mono sx-year sx-fa-ok">{counts[x.key]}</span>
              <span className="sx-arrow" aria-hidden="true"><Arrow /></span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Practice() {
  const { locale } = useI18n();
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-practice">
      <SecHead id="sx-practice" label={copy.home.practiceLabel} title={copy.practice.title} />
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

function AboutTeaser() {
  const { locale } = useI18n();
  const a = copy.about;
  return (
    <section className="sx-section sx-wrap" aria-labelledby="sx-about">
      <SecHead id="sx-about" label={copy.home.aboutLabel} title={copy.home.aboutTitle} />
      <div className="sx-about">
        <figure className="sx-portrait sx-reveal">
          <img src={person.portrait} alt={pick(person.name, locale)} loading="lazy" decoding="async" width="791" height="798" />
          <figcaption><span>{pick(person.short, locale)}</span><span>{pick(person.city, locale)}</span></figcaption>
        </figure>
        <div className="sx-about-body sx-reveal">
          <p className="sx-lede">{pick(a.lede, locale)}</p>
          <p>{pick(copy.home.aboutBody, locale)}</p>
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
      <AboutTeaser />
      <SiteMap />
      <Practice />
      <ContactCta />
    </>
  );
}
