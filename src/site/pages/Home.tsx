import { useI18n } from '../../lib/i18n';
import { brandHref } from '../../lib/unifiedRouter';
import { copy, person, pick, practice, projects, sheets, ventures } from '../content';
import { Discipline, I } from '../icons';
import { Arrow, ContactCta, SecHead, useScrollReveal } from '../shared';

function Hero() {
  const { locale } = useI18n();
  const h = copy.hero;
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
