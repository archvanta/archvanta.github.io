import { useI18n } from '../../lib/i18n';
import { useData } from '../../lib/dataContext';
import { useAsync } from '../../lib/hooks';
import { brandHref } from '../../lib/unifiedRouter';
import { portfolio, tr } from '../../content/portfolio';
import { capabilitySteps, copy, person, pick, sheets, type L } from '../content';
import { I } from '../icons';
import { VentureCards } from './Home';
import { Arrow, ContactCta, PageHead, SecHead, useScrollReveal } from '../shared';

const t = (en: string, fa: string): L => ({ en, fa });

/** A generic plan diagram of the method: existing grid, zones, clearances. It depicts no real project. */
function CapabilityDiagram() {
  return (
    <svg viewBox="0 0 420 300" fill="none" stroke="currentColor" strokeWidth="1" role="img" aria-label="Abstract method diagram: grid, zones and clearances">
      <defs>
        <pattern id="sx-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
        </pattern>
      </defs>
      {[60, 160, 260, 360].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="30" x2={x} y2="270" strokeDasharray="5 4" opacity="0.35" />
          <circle cx={x} cy="18" r="10" />
          <text x={x} y="22" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">{String.fromCharCode(65 + i)}</text>
        </g>
      ))}
      {[70, 230].map((y, i) => (
        <g key={y}>
          <line x1="30" y1={y} x2="400" y2={y} strokeDasharray="5 4" opacity="0.35" />
          <circle cx="16" cy={y} r="10" />
          <text x="16" y={y + 4} textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">{i + 1}</text>
        </g>
      ))}
      <rect x="40" y="50" width="340" height="200" strokeWidth="2" />
      {[60, 160, 260, 360].flatMap((x) => [70, 230].map((y) => <rect key={`${x}${y}`} x={x - 5} y={y - 5} width="10" height="10" fill="currentColor" />))}
      <rect x="84" y="92" width="64" height="116" fill="url(#sx-hatch)" />
      <rect x="196" y="92" width="64" height="116" fill="url(#sx-hatch)" />
      <rect x="296" y="92" width="64" height="58" strokeDasharray="3 3" />
      <rect x="148" y="92" width="48" height="116" stroke="var(--sx-accent)" strokeDasharray="4 3" />
      <path d="M172 104v92M166 110l6-6 6 6M166 190l6 6 6-6" stroke="var(--sx-accent)" />
      <path d="M296 196h64" strokeDasharray="2 3" />
      <path d="M380 150h18M398 150l-6-4M398 150l-6 4" />
    </svg>
  );
}

export function AboutPage() {
  const { locale } = useI18n();
  useScrollReveal(locale);
  const prof = portfolio.profile;
  const stats: [number, L][] = [
    [portfolio.projects.length, t('Published projects', 'پروژهٔ منتشرشده')],
    [sheets().length, t('Drawings & boards online', 'نقشه و شیت آنلاین')],
    [portfolio.objects.length, t('3D / BIM objects', 'آبجکت سه‌بعدی / BIM')],
    [portfolio.skillGroups.find((g) => g.title === 'Software')?.items.length ?? 0, t('Design applications', 'نرم‌افزار طراحی')],
  ];
  return (
    <>
      <div className="sx-wrap">
        <PageHead title={copy.page.aboutTitle} />
      </div>
      <section className="sx-section sx-wrap" style={{ paddingBlockStart: 56 }}>
        <div className="sx-about">
          <figure className="sx-portrait sx-reveal">
            <img src={person.portrait} alt={pick(person.name, locale)} width="791" height="798" decoding="async" />
            <figcaption><span>{pick(person.name, locale)}</span><span>{pick(person.city, locale)}</span></figcaption>
          </figure>
          <div className="sx-about-body sx-reveal">
            <span className="sx-mono sx-fa-ok">{pick(person.role, locale)} · {pick(person.city, locale)}</span>
            <p className="sx-lede">{tr(prof.aboutLead, locale)}</p>
            {prof.about.map((para) => <p key={para}>{tr(para, locale)}</p>)}
            <div className="sx-stats">
              {stats.map(([n, l]) => (
                <div key={l.en}><strong>{n.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}</strong><span className="sx-mono sx-fa-ok">{pick(l, locale)}</span></div>
              ))}
            </div>
            <div className="sx-hero-actions">
              <a className="sx-btn sx-btn--solid studio-resume-link" href={person.resume} download="MohammadAmin_Sadeghi_Resume.pdf"><I name="download" /> {pick(copy.cta.resume, locale)}</a>
              <a className="sx-btn" href={person.linkedin} target="_blank" rel="noopener noreferrer"><I name="linkedin" /> LinkedIn</a>
            </div>
          </div>
        </div>
      </section>

      <section className="sx-section sx-wrap" aria-labelledby="sx-cap">
        <SecHead id="sx-cap" label={t('Capability', 'توانمندی')} title={t('Technical spaces: the method', 'فضاهای فنی: روش کار')} />
        <div className="sx-capability sx-reveal">
          <CapabilityDiagram />
          <div style={{ display: 'grid', gap: 20 }}>
            <p style={{ color: 'var(--sx-ink-2)' }}>
              {pick(t(
                'Part of my work is planning equipment-heavy technical rooms inside buildings that already exist. That client work appears under Work without client, site or team details. This is the method I bring to it.',
                'بخشی از کار من برنامه‌ریزی اتاق‌های فنی پرتجهیز داخل ساختمان‌های موجود است. این کارها در بخش پروژه‌ها بدون نام کارفرما، محل پروژه و اعضای تیم آمده‌اند. این روشی است که برای آن به کار می‌برم.',
              ), locale)}
            </p>
            <ol>
              {capabilitySteps.map((s) => (
                <li key={s.t.en}><div><strong>{pick(s.t, locale)}</strong><span>{pick(s.d, locale)}</span></div></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="sx-section sx-wrap" aria-labelledby="sx-cv">
        <SecHead id="sx-cv" label={t('Record', 'سوابق')} title={t('Experience & skills', 'سابقه و مهارت‌ها')} />
        <div className="sx-cv sx-reveal">
          <h3>{pick(t('Experience', 'سابقهٔ کاری'), locale)}</h3>
          <ul className="sx-cv-list">
            {portfolio.experience.map((e) => (
              <li key={e.org}>
                <div><h4>{tr(e.role, locale)}</h4><span className="sx-mono sx-fa-ok">{tr(e.org, locale)}</span></div>
                <ul>{e.duties.map((d) => <li key={d}>{tr(d, locale)}</li>)}</ul>
              </li>
            ))}
          </ul>
          <h3>{pick(t('Skills', 'مهارت‌ها'), locale)}</h3>
          <ul className="sx-cv-list">
            {portfolio.skillGroups.map((g) => (
              <li key={g.title}>
                <h4>{tr(g.title, locale)}</h4>
                <div className="sx-skills">{g.items.map((s) => <span key={s} className="sx-tag">{tr(s, locale)}</span>)}</div>
              </li>
            ))}
          </ul>
          <h3>{pick(t('Education', 'تحصیلات'), locale)}</h3>
          <ul className="sx-cv-list">
            <li>
              <div><h4>{pick(t('B.Arch, Architecture', 'کارشناسی معماری'), locale)}</h4><span className="sx-mono sx-fa-ok">{pick(t('In progress', 'در حال تحصیل'), locale)}</span></div>
              <p>{pick(t('Islamic Azad University, Central Tehran Branch (Poonak)', 'دانشگاه آزاد اسلامی، واحد تهران مرکزی (پونک)'), locale)}</p>
            </li>
            <li>
              <h4>{pick(t('Languages', 'زبان‌ها'), locale)}</h4>
              <p>{pick(t('Persian — native · English — upper-intermediate', 'فارسی — زبان مادری · انگلیسی — بالاتر از متوسط'), locale)}</p>
            </li>
          </ul>
        </div>
      </section>
      <ContactCta />
    </>
  );
}

export function VenturesPage() {
  const { locale } = useI18n();
  useScrollReveal(locale);
  return (
    <>
      <div className="sx-wrap"><PageHead title={copy.page.venturesTitle} body={copy.ventures.intro} /></div>
      <section className="sx-section sx-wrap" style={{ paddingBlockStart: 56 }}><VentureCards /></section>
      <section className="sx-section sx-wrap" aria-labelledby="sx-models">
        <SecHead id="sx-models" label={t('Lab', 'آزمایشگاه')} title={t('Interactive 3D objects', 'آبجکت‌های سه‌بعدی تعاملی')} />
        <ul className="sx-index">
          {portfolio.objects.map((o, i) => (
            <li key={o.file} className="sx-reveal">
              <a href={brandHref(`/lab/${o.file}`)}>
                <span className="sx-mono sx-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{ fontSize: 'clamp(22px,2.6vw,36px)' }}>{tr(o.title, locale)}</h3>
                <span className="sx-index-meta">{tr(o.type, locale)}</span>
                <span className="sx-mono sx-year">3D</span>
                <span className="sx-arrow" aria-hidden="true"><Arrow /></span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function FrontierPage() {
  const { locale } = useI18n();
  const data = useData();
  const meta = useAsync(() => data.meta(), [data]);
  useScrollReveal(locale);
  const flow: [L, L][] = [
    [t('Collect', 'جمع‌آوری'), t('Public RSS feeds and official sources, read by a scheduled GitHub Action.', 'خوراک‌های RSS عمومی و منابع رسمی، با یک GitHub Action زمان‌بندی‌شده.')],
    [t('Normalise', 'یکسان‌سازی'), t('Canonical URLs, original titles, sources and times kept; only short excerpts stored.', 'نشانی، عنوان، منبع و زمان اصلی حفظ می‌شود؛ فقط خلاصهٔ کوتاه ذخیره می‌شود.')],
    [t('Deduplicate', 'حذف تکراری'), t('The same event from several outlets becomes one story.', 'یک رویداد از چند رسانه به یک خبر تبدیل می‌شود.')],
    [t('Rank', 'رتبه‌بندی'), t('An open, deterministic score builds daily, weekly and monthly picks.', 'امتیازی باز و قطعی، منتخب‌های روزانه، هفتگی و ماهانه را می‌سازد.')],
    [t('Publish', 'انتشار'), t('Versioned JSON and a static bilingual site on GitHub Pages. No paid APIs.', 'JSON نسخه‌دار و سایت ایستای دوزبانه روی GitHub Pages. بدون API پولی.')],
  ];
  const m = meta.status === 'ready' ? meta.data : null;
  const facts: [number, L][] = m
    ? [
        [m.articleCount, t('Stories in the archive', 'خبر در آرشیو')],
        [m.dayCount, t('Days collected', 'روز جمع‌آوری‌شده')],
        [m.sourcesOk, t('Sources read last run', 'منبع خوانده‌شده در آخرین اجرا')],
      ]
    : [];
  return (
    <>
      <div className="sx-wrap">
        <PageHead
          crumb={copy.page.venturesTitle}
          title={t('FRONTIER', 'FRONTIER')}
          body={t(
            'A bilingual news desk for the technologies that shape architecture and computing: AI, games and data infrastructure. Designed and built end to end.',
            'میز خبری دوزبانه برای فناوری‌هایی که معماری و رایانش را شکل می‌دهند: هوش مصنوعی، بازی و زیرساخت داده. طراحی و ساخت از صفر تا صد.',
          )}
        />
      </div>
      <section className="sx-section sx-wrap" style={{ paddingBlockStart: 56 }}>
        <div className="sx-split">
          <figure className="sx-shot sx-reveal" style={{ margin: 0 }}>
            <img src="/images/frontier-live.webp" alt={pick(t('FRONTIER home page, screenshot', 'صفحهٔ اول FRONTIER، تصویر صفحه'), locale)} loading="lazy" />
          </figure>
          <div className="sx-about-body sx-reveal">
            <p className="sx-lede">{pick(t('News without paid APIs, ranked in the open.', 'خبر بدون API پولی، با رتبه‌بندی شفاف.'), locale)}</p>
            <p>{pick(t(
              'FRONTIER reads public sources several times a day, removes duplicates and ranks stories with a formula anyone can read. Persian and English share one design system with full RTL support and light and dark themes.',
              'FRONTIER چند بار در روز منابع عمومی را می‌خواند، تکراری‌ها را حذف می‌کند و خبرها را با فرمولی که همه می‌توانند بخوانند رتبه‌بندی می‌کند. فارسی و انگلیسی یک سیستم طراحی مشترک با پشتیبانی کامل راست‌به‌چپ و تم روشن و تیره دارند.',
            ), locale)}</p>
            {facts.length > 0 && (
              <div className="sx-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }} data-testid="frontier-stats">
                {facts.map(([n, l]) => (
                  <div key={l.en}><strong>{n.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}</strong><span className="sx-mono sx-fa-ok">{pick(l, locale)}</span></div>
                ))}
              </div>
            )}
            <div className="sx-hero-actions">
              <a className="sx-btn sx-btn--solid" href="#/frontier/">{pick(t('Open FRONTIER', 'باز کردن FRONTIER'), locale)} <Arrow /></a>
              <a className="sx-btn" href="https://github.com/archvanta/frontier" target="_blank" rel="noopener noreferrer"><I name="github" /> {pick(t('Source', 'کد منبع'), locale)}</a>
            </div>
          </div>
        </div>
      </section>
      <section className="sx-section sx-wrap" aria-labelledby="sx-flow">
        <SecHead id="sx-flow" label={t('Pipeline', 'روند کار')} title={t('How a story gets here', 'خبر چطور به اینجا می‌رسد')} />
        <ol className="sx-flow sx-reveal">
          {flow.map(([a, b], i) => (
            <li key={a.en}><span className="sx-mono">{String(i + 1).padStart(2, '0')}</span><strong>{pick(a, locale)}</strong><span>{pick(b, locale)}</span></li>
          ))}
        </ol>
      </section>
    </>
  );
}

export function ContactPage() {
  const { locale } = useI18n();
  useScrollReveal(locale);
  const rows: [L, string, string, 'mail' | 'linkedin' | 'github' | 'download'][] = [
    [t('Email', 'ایمیل'), person.email, `mailto:${person.email}`, 'mail'],
    [t('LinkedIn', 'لینکدین'), 'in/aminetun', person.linkedin, 'linkedin'],
    [t('GitHub', 'گیت‌هاب'), 'archvanta', person.github, 'github'],
    [t('Résumé', 'رزومه'), 'PDF', person.resume, 'download'],
  ];
  return (
    <>
      <div className="sx-wrap"><PageHead title={copy.page.contactTitle} body={copy.page.contactBody} /></div>
      <section className="sx-section sx-wrap" style={{ paddingBlockStart: 56 }}>
        <div className="sx-contact">
          <p className="sx-lede sx-reveal">{pick(copy.cta.body, locale)}</p>
          <ul className="sx-contact-list sx-reveal">
            {rows.map(([label, value, url, icon]) => (
              <li key={url}>
                <a href={url} {...(url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...(icon === 'download' ? { download: 'MohammadAmin_Sadeghi_Resume.pdf' } : {})}>
                  <span className="sx-mono sx-fa-ok">{pick(label, locale)}</span>
                  <span dir="ltr" style={{ textAlign: 'start' }}>{value}</span>
                  <I name={icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
