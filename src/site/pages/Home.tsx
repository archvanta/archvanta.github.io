import { useEffect, useState } from 'react';
import Elias, { type EliasBook } from '../../components/ui/elias-author-hero';
import { useI18n } from '../../lib/i18n';
import { brandHref } from '../../lib/unifiedRouter';
import { copy, person, pick, practice, projects, sheets, ventures } from '../content';
import { Discipline, I } from '../icons';
import { Arrow, ContactCta, SecHead, useScrollReveal } from '../shared';

const SPLASH_KEY = 'archvanta:splash-seen';

/** The ink splash plays once per browser session; repeat visits go straight to the hero. */
function useSplashOnce() {
  const [show] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_KEY);
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      /* storage blocked: the splash simply plays again next time */
    }
  }, []);
  return show;
}

function Hero() {
  const { locale } = useI18n();
  const e = copy.elias;
  const showSplash = useSplashOnce();
  const books: EliasBook[] = e.books.map((b) => ({
    label: pick(b.label, locale),
    title: pick(b.title, locale),
    coverLines: b.coverLines[locale],
    topics: b.topics[locale],
    art: b.art as EliasBook['art'],
    colors: b.colors,
    chapter: pick(e.bookCard.chapter, locale),
    chapterTitle: pick(b.chapterTitle, locale),
    text: pick(b.text, locale),
    href: b.href.startsWith('#') ? b.href : brandHref(b.href),
  }));
  return (
    <section className="sx-hero sx-hero--elias" aria-label={pick(person.name, locale)}>
      {/* The composition is laid out left to right in both languages; the text blocks inside switch to RTL in CSS. */}
      <div dir="ltr">
      <Elias
        key={locale}
        showSplash={showSplash}
        name={e.name[locale]}
        intro={{ roles: e.roles[locale], headline: e.headline[locale], description: pick(copy.hero.body, locale) }}
        portrait={{ src: '/images/amin-cutout.webp', width: 656, height: 686, alt: pick(person.name, locale) }}
        books={books}
        bookCard={{ href: brandHref('/work'), open: pick(e.bookCard.open, locale), close: pick(e.bookCard.close, locale), folio: '1' }}
        letter={{
          eyebrow: pick(e.letter.eyebrow, locale),
          greeting: pick(e.letter.greeting, locale),
          stamp: pick(e.letter.stamp, locale),
          postmark: pick(e.letter.postmark, locale),
          seal: 'A',
          sealing: pick(e.letter.sealing, locale),
          messages: e.letter.messages[locale],
          counter: pick(e.letter.counter, locale),
        }}
        socialLinks={[
          { label: 'LinkedIn', href: person.linkedin },
          { label: 'GitHub', href: person.github },
          { label: locale === 'fa' ? 'ایمیل' : 'Email', href: `mailto:${person.email}` },
        ]}
        motion={{ cursor: { readLabel: pick(e.cursor, locale) } }}
        labels={{ socials: pick(e.socialsLabel, locale), readAbout: pick(e.readAbout, locale), dateLocale: locale === 'fa' ? 'fa-IR' : 'en-US' }}
      />
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
