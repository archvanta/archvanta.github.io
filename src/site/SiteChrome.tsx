import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useTheme } from '../lib/theme';
import { brandHref, type AppRoute } from '../lib/unifiedRouter';
import { UserMenu } from '../components/account/UserMenu';
import { copy, person, pick } from './content';
import { I } from './icons';
import { Mark, Wordmark } from './Logo';

type Key = 'work' | 'drawings' | 'about' | 'ventures' | 'frontier' | 'contact';
const NAV: { key: Key; href: string }[] = [
  { key: 'work', href: brandHref('/work') },
  { key: 'drawings', href: brandHref('/drawings') },
  { key: 'about', href: brandHref('/about') },
  { key: 'ventures', href: brandHref('/ventures') },
  { key: 'frontier', href: '#/frontier/' },
  { key: 'contact', href: brandHref('/contact') },
];

function activeKey(route: AppRoute): Key | null {
  if (route.kind === 'editorial') return 'frontier';
  switch (route.page) {
    case 'work':
    case 'project':
      return 'work';
    case 'drawings':
      return 'drawings';
    case 'about':
      return 'about';
    case 'ventures':
    case 'venture':
    case 'model':
      return 'ventures';
    case 'contact':
      return 'contact';
    default:
      return null;
  }
}

export function SiteHeader({ route }: { route: AppRoute }) {
  const { locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const active = activeKey(route);
  const n = copy.nav;

  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) {
      d.close();
      opener.current?.focus();
    }
  }, [open]);

  const links = (numbered: boolean) =>
    NAV.map((item, i) => (
      <li key={item.key}>
        <a href={item.href} aria-current={active === item.key ? 'page' : undefined}>
          {numbered && <span>{String(i + 1).padStart(2, '0')}</span>}
          {pick(n[item.key], locale)}
        </a>
      </li>
    ));

  const tools = (
    <>
      <a className="sx-icon-btn sx-hide-sm" href={brandHref('/search')} aria-label={pick(n.search, locale)} title={pick(n.search, locale)}>
        <I name="search" />
      </a>
      <button
        type="button"
        className="sx-icon-btn sx-lang"
        onClick={() => setLocale(locale === 'en' ? 'fa' : 'en')}
        title={pick(n.langLabel, locale)}
      >
        <span aria-hidden="true" lang={locale === 'en' ? 'fa' : 'en'}>{pick(n.lang, locale)}</span>
        <span className="sx-visually-hidden">{pick(n.langLabel, locale)}</span>
      </button>
      <button
        type="button"
        className="sx-icon-btn"
        onClick={toggle}
        aria-label={pick(theme === 'dark' ? n.toLight : n.toDark, locale)}
        title={pick(theme === 'dark' ? n.toLight : n.toDark, locale)}
      >
        <I name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
    </>
  );

  return (
    <header className="sx-header">
      <div className="sx-header-in">
        <a className="sx-brand" href={brandHref('/')} aria-label={pick(n.home, locale)}>
          <Mark />
          <Wordmark />
        </a>
        <nav className="sx-nav" aria-label={locale === 'fa' ? 'اصلی' : 'Main'}>
          <ul>{links(false)}</ul>
        </nav>
        <div className="sx-tools">
          {tools}
          <UserMenu route={route.kind === 'editorial' ? route.route : { name: 'home', page: 1 }} />
          <button
            ref={opener}
            type="button"
            className="sx-icon-btn sx-menu-btn"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={pick(n.menu, locale)}
          >
            <I name="menu" />
          </button>
        </div>
      </div>
      <dialog ref={dialog} className="sx-drawer" onClose={() => setOpen(false)} aria-label={pick(n.menu, locale)}>
        <div className="sx-drawer-top">
          <a className="sx-brand" href={brandHref('/')} aria-label={pick(n.home, locale)}>
            <Mark />
            <Wordmark />
          </a>
          <button type="button" className="sx-icon-btn" onClick={() => setOpen(false)} aria-label={pick(n.close, locale)}>
            <I name="close" />
          </button>
        </div>
        <nav aria-label={locale === 'fa' ? 'اصلی' : 'Main'}>
          <ol>{links(true)}</ol>
        </nav>
        <div className="sx-drawer-foot">
          <a className="sx-btn" href={`mailto:${person.email}`}>
            <I name="mail" /> {person.email}
          </a>
        </div>
      </dialog>
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useI18n();
  const f = copy.footer;
  return (
    <footer className="sx-footer">
      <div className="sx-wrap">
        <div className="sx-footer-top">
          <div className="sx-footer-about">
            <a className="sx-brand" href={brandHref('/')} aria-label={pick(copy.nav.home, locale)}>
              <Mark />
              <Wordmark />
            </a>
            <p>{pick(f.blurb, locale)}</p>
          </div>
          <div>
            <h3>{pick(f.site, locale)}</h3>
            <ul>
              {NAV.map((item) => (
                <li key={item.key}>
                  <a href={item.href}>{pick(copy.nav[item.key], locale)}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{pick(f.elsewhere, locale)}</h3>
            <ul>
              <li><a href={person.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a></li>
              <li><a href={person.github} rel="noopener noreferrer" target="_blank">GitHub</a></li>
              <li><a href={person.resume} download="MohammadAmin_Sadeghi_Resume.pdf">{pick(copy.cta.resume, locale)}</a></li>
            </ul>
          </div>
          <div>
            <h3>{pick(f.studio, locale)}</h3>
            <ul>
              <li><a href={`mailto:${person.email}`} dir="ltr">{person.email}</a></li>
              <li><span className="sx-mono">35.69°N 51.39°E</span></li>
              <li><span style={{ color: 'var(--sx-ink-2)' }}>{pick(person.city, locale)}</span></li>
            </ul>
          </div>
        </div>
        <Wordmark className="sx-footer-big" />
        <div className="sx-footer-base">
          <span className="sx-mono">© {new Date().getFullYear()} ARCHVANTA</span>
          <span className="sx-mono sx-fa-ok">{pick(f.rights, locale)}</span>
        </div>
      </div>
    </footer>
  );
}
