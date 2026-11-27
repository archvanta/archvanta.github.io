import { useEffect, type ReactNode } from 'react';
import { useI18n } from '../lib/i18n';
import { brandHref } from '../lib/unifiedRouter';
import { copy, pick, type L } from './content';
import { I } from './icons';

/** Adds `.is-in` to `.sx-reveal` elements as they enter the viewport. Content stays visible without JS/IO. */
export function useScrollReveal(dep?: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.sx-reveal:not(.is-in)'));
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((e) => io.observe(e));
    // Printing never leaves content hidden.
    const show = () => els.forEach((e) => e.classList.add('is-in'));
    window.addEventListener('beforeprint', show);
    return () => {
      io.disconnect();
      window.removeEventListener('beforeprint', show);
    };
  }, [dep]);
}

export function SecHead({ id, label, title, action }: { id?: string; label: L; title: L; action?: ReactNode }) {
  const { locale } = useI18n();
  return (
    <header className="sx-sec-head sx-reveal">
      <span className="sx-mono sx-fa-ok">{pick(label, locale)}</span>
      <h2 id={id}>{pick(title, locale)}</h2>
      {action}
    </header>
  );
}

export function PageHead({ crumb, title, body }: { crumb?: L; title: L; body?: L }) {
  const { locale } = useI18n();
  return (
    <header className="sx-page-head">
      <nav className="sx-crumbs sx-mono sx-fa-ok" aria-label={locale === 'fa' ? 'مسیر' : 'Breadcrumb'}>
        <a href={brandHref('/')}>ARCHVANTA</a>
        <span aria-hidden="true">/</span>
        <span>{pick(crumb ?? title, locale)}</span>
      </nav>
      <h1>{pick(title, locale)}</h1>
      {body && <p>{pick(body, locale)}</p>}
    </header>
  );
}

export function Arrow({ size = 16 }: { size?: number }) {
  return <I name="arrow" size={size} className="sx-flip" />;
}

export function ContactCta() {
  const { locale } = useI18n();
  const c = copy.cta;
  return (
    <section className="sx-cta sx-wrap" aria-labelledby="sx-cta-title">
      <h2 id="sx-cta-title" className="sx-reveal">
        {pick(c.title1, locale)}
        <br />
        <span className="sx-serif">{pick(c.title2, locale)}</span>
      </h2>
      <p className="sx-reveal" style={{ color: 'var(--sx-ink-2)' }}>{pick(c.body, locale)}</p>
      <a className="sx-mail sx-reveal" href="mailto:sadeghimohammadamin83@gmail.com">sadeghimohammadamin83@gmail.com</a>
      <a className="sx-btn sx-reveal" href="/documents/MohammadAmin_Sadeghi_Resume.pdf" download="MohammadAmin_Sadeghi_Resume.pdf">
        <I name="download" /> {pick(c.resume, locale)}
      </a>
    </section>
  );
}
