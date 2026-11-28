import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { brandHref } from '../../lib/unifiedRouter';
import { portfolio, tr, type PortfolioImage, type PortfolioProject } from '../../content/portfolio';
import { copy, pendingProject, pick, projects, sheets } from '../content';
import { I } from '../icons';
import { Mark } from '../Logo';
import { PlanViewer } from '../PlanViewer';
import { Arrow, ContactCta, PageHead, SecHead, useScrollReveal } from '../shared';

const DC = 'Data Center Design';

function WorkCard({ x, n }: { x: PortfolioProject; n?: number }) {
  const { locale } = useI18n();
  const dc = x.category === DC;
  return (
    <a className={`sx-card sx-reveal${dc ? ' sx-card--dc' : ''}`} href={brandHref(`/work/${x.slug}`)} data-testid="work-card">
      {x.cover ? (
        <div className="sx-card-media">
          <img src={x.cover.src} alt={tr(x.cover.label ?? x.title, locale)} loading="lazy" decoding="async" />
          <span className="sx-chip">{tr(x.status, locale)}</span>
        </div>
      ) : (
        <div className="sx-card-media sx-card-media--plain sx-grid-bg" data-testid="work-card-placeholder">
          <span className="sx-chip">{tr(x.status, locale)}</span>
          {n !== undefined && <span className="sx-card-index" aria-hidden="true">{String(n).padStart(2, '0')}</span>}
          <span className="sx-card-kicker">{tr(x.kicker ?? x.discipline, locale)}</span>
          {dc && <span className="sx-mono sx-fa-ok sx-card-pending"><I name="lock" /> {pick(copy.work.dcPending, locale)}</span>}
        </div>
      )}
      <div className="sx-card-meta"><span className="sx-mono sx-fa-ok">{tr(x.category, locale)}</span><span className="sx-mono">{x.year}</span></div>
      <h3>{tr(x.title, locale)}</h3>
      <p>{tr(x.summary, locale)}</p>
    </a>
  );
}

function PendingCard() {
  const { locale } = useI18n();
  return (
    <div className="sx-card sx-card--pending sx-reveal" aria-disabled="true">
      <div className="sx-card-media sx-grid-bg"><Mark className="" /><span className="sx-chip">{pick(copy.work.pending, locale)}</span></div>
      <div className="sx-card-meta"><span className="sx-mono sx-fa-ok">{pick(pendingProject.type, locale)}</span><span className="sx-mono">{pendingProject.year}</span></div>
      <h3>{pick(pendingProject.title, locale)}</h3>
    </div>
  );
}

export function WorkPage() {
  const { locale } = useI18n();
  const p = copy.page;
  const w = copy.work;
  const list = projects();
  const cats = useMemo(() => Array.from(new Set(list.map((x) => x.category))), [list]);
  const [cat, setCat] = useState<string | null>(null);
  useScrollReveal(`${locale}${cat}`);
  const shown = list.filter((x) => !cat || x.category === cat);
  const dc = list.filter((x) => x.category === DC);
  const rest = list.filter((x) => x.category !== DC);
  return (
    <>
      <div className="sx-wrap">
        <PageHead title={p.workTitle} body={p.workBody} />
      </div>
      <section className="sx-section sx-wrap" style={{ paddingBlockStart: 40 }}>
        <div className="sx-filter" role="group" aria-label={locale === 'fa' ? 'دسته‌بندی' : 'Category'}>
          <button type="button" aria-pressed={cat === null} onClick={() => setCat(null)}>{pick(p.filterAll, locale)} · {list.length + 1}</button>
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{tr(c, locale)}</button>
          ))}
        </div>
        {cat ? (
          <div className="sx-cards">
            {shown.map((x) => <WorkCard key={x.slug} x={x} />)}
          </div>
        ) : (
          <>
            {dc.length > 0 && (
              <div className="sx-work-group sx-work-group--dc" data-testid="work-dc">
                <SecHead id="sx-work-dc" label={w.dcLabel} title={w.dcTitle} />
                <p className="sx-work-note sx-reveal"><I name="lock" /> {pick(w.dcNote, locale)}</p>
                <div className="sx-cards">
                  {dc.map((x, k) => <WorkCard key={x.slug} x={x} n={k + 1} />)}
                </div>
              </div>
            )}
            <div className="sx-work-group">
              <SecHead id="sx-work-other" label={w.otherLabel} title={w.otherTitle} />
              <div className="sx-cards">
                {rest.map((x) => <WorkCard key={x.slug} x={x} />)}
                <PendingCard />
              </div>
            </div>
          </>
        )}
      </section>
      <ContactCta />
    </>
  );
}

function Lightbox({ items, index, onClose, onIndex }: { items: PortfolioImage[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const { locale } = useI18n();
  const d = useRef<HTMLDialogElement>(null);
  const p = copy.page;
  useEffect(() => {
    const el = d.current;
    if (el && !el.open) el.showModal();
    document.documentElement.classList.add('lenis-stopped');
    return () => document.documentElement.classList.remove('lenis-stopped');
  }, []);
  const it = items[index] ?? items[0]!;
  const go = (k: number) => onIndex((index + k + items.length) % items.length);
  return (
    <dialog
      ref={d}
      className="sx-lightbox"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(locale === 'fa' ? -1 : 1);
        if (e.key === 'ArrowLeft') go(locale === 'fa' ? 1 : -1);
      }}
      aria-label={tr(it.label, locale)}
    >
      <div className="sx-lightbox-in">
        <div className="sx-lightbox-bar">
          <span className="sx-mono">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="sx-icon-btn" onClick={() => go(-1)} aria-label={pick(p.prevImage, locale)}><I name="arrow" style={{ transform: locale === 'fa' ? undefined : 'scaleX(-1)' }} /></button>
            <button type="button" className="sx-icon-btn" onClick={() => go(1)} aria-label={pick(p.nextImage, locale)}><I name="arrow" className="sx-flip" /></button>
            <button type="button" className="sx-icon-btn" onClick={() => d.current?.close()} aria-label={pick(p.closeImage, locale)} autoFocus><I name="close" /></button>
          </div>
        </div>
        <figure>
          <img src={it.src} alt={tr(it.label, locale)} />
        </figure>
        <figcaption>{tr(it.label, locale)}{it.caption ? ` — ${tr(it.caption, locale)}` : ''}</figcaption>
      </div>
    </dialog>
  );
}

export function ProjectPage({ slug }: { slug?: string }) {
  const { locale } = useI18n();
  const p = copy.page;
  const list = projects();
  const i = list.findIndex((x) => x.slug === slug);
  const pr = list[i];
  const [lb, setLb] = useState<{ items: PortfolioImage[]; i: number } | null>(null);
  useScrollReveal(`${slug}${locale}`);
  if (!pr) {
    return (
      <div className="sx-wrap">
        <PageHead title={{ en: 'Not found', fa: 'پیدا نشد' }} body={p.notFound} />
        <p style={{ paddingBlock: 40 }}><a className="sx-link" href={brandHref('/work')}>{pick(p.back, locale)} <Arrow /></a></p>
      </div>
    );
  }
  const next = list[(i + 1) % list.length] ?? pr;
  const drawingSheets = sheets().filter((s) => s.project === pr.slug && s.kind.en !== 'Board');
  const drawIds = new Set(drawingSheets.map((s) => s.src));
  const images = (pr.gallery ?? []).filter((g) => !drawIds.has(g.src));
  const boards = pr.boards?.items ?? [];
  const facts = ([
    [pick(p.type, locale), tr(pr.type ?? pr.category, locale)],
    [pick(p.role, locale), tr(pr.role, locale)],
    [pick(p.year, locale), pr.timeline ? tr(pr.timeline, locale) : pr.year ?? ''],
    [pick(p.status, locale), tr(pr.status, locale)],
    ...(pr.facts ?? []).map((f) => [tr(f[0], locale), tr(f[1], locale)]),
    [pick(p.tools, locale), (pr.tools ?? []).join(' · ')],
  ] as [string, string][]).filter(([, v]) => v);
  const story = (['overview', 'challenge', 'approach', 'solution', 'learned'] as const).filter((k) => pr[k]);
  const proposal = pr.proposal
    ? Array.from({ length: pr.proposal.pages }, (_, k) => ({
        src: `/work-media/images/pp-${pr.slug}-${String(k + 1).padStart(2, '0')}.webp`,
        label: `${tr(pr.proposal!.label, locale)} ${k + 1}`,
      }))
    : [];
  return (
    <article>
      <header className={`sx-proj-hero${pr.cover ? '' : ' sx-proj-hero--plain sx-grid-bg'}`}>
        {pr.cover && <img src={pr.cover.src} alt={tr(pr.cover.label ?? pr.title, locale)} fetchPriority="high" />}
        <div className="sx-proj-hero-text">
          <div className="sx-wrap" style={{ display: 'grid', gap: 18 }}>
            <nav className="sx-crumbs sx-mono sx-fa-ok" aria-label={locale === 'fa' ? 'مسیر' : 'Breadcrumb'}>
              <a href={brandHref('/work')}>{pick(copy.nav.work, locale)}</a>
              <span aria-hidden="true">/</span>
              <span>{tr(pr.category, locale)} · {pr.year}</span>
            </nav>
            <h1>{tr(pr.title, locale)}</h1>
          </div>
        </div>
      </header>
      <div className="sx-section sx-wrap">
        <div className="sx-proj-grid">
          <dl className="sx-facts">
            {facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className="sx-story">
            {pr.kicker && <p className="sx-lede sx-reveal">{tr(pr.kicker, locale)}</p>}
            <p className="sx-reveal" style={{ fontSize: 19, color: 'var(--sx-ink)' }}>{tr(pr.summary, locale)}</p>
            {story.map((k) => (
              <section key={k} className="sx-reveal sx-story-part">
                <span className="sx-mono sx-fa-ok">{pick(p[k], locale)}</span>
                <p>{tr(pr[k], locale)}</p>
              </section>
            ))}
            {pr.credit && <div className="sx-mono sx-fa-ok sx-credit" data-testid="project-credit">{tr(pr.credit, locale)}</div>}
            {pr.category === DC && (
              <aside className="sx-redacted sx-reveal" data-testid="project-redacted">
                <I name="lock" />
                <div>
                  <strong>{pick(copy.work.dcPending, locale)}</strong>
                  <p>{pick(copy.work.dcNote, locale)}</p>
                </div>
              </aside>
            )}
            {pr.model && (
              <p><a className="sx-btn" href={brandHref(`/lab/${pr.model}`)}>{pick(p.model, locale)} <Arrow /></a></p>
            )}
          </div>
        </div>
      </div>
      {drawingSheets.length > 0 && (
        <section className="sx-section sx-wrap" aria-labelledby="sx-proj-drawings">
          <header className="sx-sec-head sx-reveal"><span className="sx-mono sx-fa-ok">{drawingSheets.length}</span><h2 id="sx-proj-drawings">{pick(p.drawings, locale)}</h2></header>
          <PlanViewer sheets={drawingSheets} title={tr(pr.title, locale)} />
        </section>
      )}
      {(images.length > 0 || boards.length > 0 || proposal.length > 0) && (
        <section className="sx-section sx-wrap" aria-labelledby="sx-proj-images">
          <header className="sx-sec-head sx-reveal"><span className="sx-mono sx-fa-ok">{images.length + boards.length + proposal.length}</span><h2 id="sx-proj-images">{pick(proposal.length ? p.proposal : p.gallery, locale)}</h2></header>
          <div className="sx-gallery">
            {[...images, ...boards, ...proposal].map((g, k, all) => (
              <figure key={g.src} className={`sx-reveal ${k % 5 === 0 ? 'is-wide' : ''}`}>
                <button type="button" onClick={() => setLb({ items: all, i: k })} style={{ ['--r' as string]: k % 5 === 0 ? '16 / 8' : '4 / 3' }} aria-label={tr(g.label, locale)}>
                  <img src={g.src} alt="" loading="lazy" decoding="async" />
                </button>
                <figcaption><span>{tr(g.label, locale)}</span><span className="sx-mono">{String(k + 1).padStart(2, '0')}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <div className="sx-wrap">
        <a className="sx-next" href={brandHref(`/work/${next.slug}`)}>
          <div style={{ display: 'grid', gap: 10 }}>
            <span className="sx-mono sx-fa-ok">{pick(p.next, locale)}</span>
            <h2>{tr(next.title, locale)}</h2>
          </div>
          <span className="sx-icon-btn" aria-hidden="true" style={{ inlineSize: 64, blockSize: 64 }}><Arrow size={24} /></span>
        </a>
      </div>
      {lb && <Lightbox items={lb.items} index={lb.i} onClose={() => setLb(null)} onIndex={(n) => setLb({ ...lb, i: n })} />}
    </article>
  );
}

export function DrawingsPage({ params }: { params: URLSearchParams }) {
  const { locale } = useI18n();
  const all = sheets();
  const byProject = portfolio.projects.filter((p) => all.some((s) => s.project === p.slug));
  const [proj, setProj] = useState<string | null>(null);
  const shown = proj ? all.filter((s) => s.project === proj) : all;
  const initial = params.get('sheet') ?? undefined;
  return (
    <>
      <div className="sx-wrap">
        <PageHead title={copy.page.drawingsTitle} body={copy.drawings.intro} />
      </div>
      <section className="sx-section sx-wrap" style={{ paddingBlockStart: 40 }}>
        <div className="sx-filter" role="group" aria-label={locale === 'fa' ? 'پروژه' : 'Project'}>
          <button type="button" aria-pressed={proj === null} onClick={() => setProj(null)}>{pick(copy.page.filterAll, locale)} · {all.length}</button>
          {byProject.map((p) => (
            <button key={p.slug} type="button" aria-pressed={proj === p.slug} onClick={() => setProj(p.slug)}>{tr(p.title, locale)}</button>
          ))}
        </div>
        <PlanViewer
          key={proj ?? 'all'}
          tall
          sheets={shown}
          initial={initial}
          onSelect={(id) => history.replaceState(null, '', brandHref('/drawings', { sheet: id }))}
        />
      </section>
    </>
  );
}
