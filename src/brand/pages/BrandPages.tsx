import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "../../lib/i18n";
import { useData } from "../../lib/dataContext";
import { useAsync } from "../../lib/hooks";
import { sortNewestFirst, uniqueById } from "../../lib/archive";
import { pickHeroStories } from "../../lib/heroStories";
import { href } from "../../lib/router";
import { brandHref, type AppRoute } from "../../lib/unifiedRouter";
import { messages } from "../../content/messages";
import {
  portfolio,
  creatorName,
  tr,
  type PortfolioImage,
} from "../../content/portfolio";
import {
  projectCatalog,
  categories,
  projectMatches,
  expertise,
  type ProjectRecord,
} from "../../content/catalog";
import { ProjectHeadlines } from "../../components/ui/project-headlines";
import { ParallaxComponent } from "../../components/ui/parallax-scrolling";
import { CreatorSignature, LabSchematic } from "../../components/StudioDetails";
import { DigitalProjects } from "../../components/DigitalProjects";
import { StoryCard } from "../../components/StoryCard";
import { Icon } from "../../components/Icon";
import { EmptyState, ErrorState, Loading } from "../../components/States";
import { Expertise } from "../sections/Expertise";
import { Systems } from "../sections/Systems";
import { About } from "../sections/About";
import { Contact } from "../sections/Contact";
import { useReveal } from "../lib/useReveal";
import { GlobalSearchPage } from "./SearchPage";
import "../../styles/brand.css";

type BrandRoute = Extract<AppRoute, { kind: "brand" }>;
function PageTitle({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body?: string;
}) {
  return (
    <header className="av-page-title">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {body && <p>{body}</p>}
    </header>
  );
}
export function ProjectCards({ items }: { items: ProjectRecord[] }) {
  const { locale } = useI18n();
  const m = messages[locale];
  return (
    <div className="av-project-grid">
      {items.map((p, i) => (
        <article className="av-project-card" key={p.slug}>
          <a href={brandHref("/projects/" + p.slug)}>
            <div
              className="av-project-image"
              data-tone={
                i % 3 === 0 ? "indigo" : i % 3 === 1 ? "teal" : "crimson"
              }
            >
              <img
                src={p.cover}
                alt={p.title}
                loading="lazy"
                decoding="async"
                width="1000"
                height="750"
              />
              <span className="av-project-status">{p.status}</span>
              <span className="av-project-open">
                <Icon name="external" size={20} />
              </span>
            </div>
            <p className="eyebrow">
              {p.category} / {p.source?.year || "ARCHVANTA STUDY"}
            </p>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <small>{p.kind === "concept" ? m.concept : m.source}</small>
          </a>
        </article>
      ))}
    </div>
  );
}
function SelectedWork() {
  const { locale } = useI18n();
  const m = messages[locale];
  return (
    <section className="section section-wrap studio-selected-work" id="selected-work">
      <div className="av-section-top">
        <div>
          <p className="eyebrow">ARCHVANTA / PROJECTS</p>
          <h2>{m.selected}</h2>
        </div>
        <a className="text-link" href={brandHref("/projects")}>
          {m.back}
          <Icon name="arrow" directional />
        </a>
      </div>
      <ProjectHeadlines
        projects={projectCatalog(locale)
          .filter((p) =>
            [
              "modular-data-centre",
              "the-last-shadow-of-time",
              "technical-level-48-racks",
            ].includes(p.slug),
          )}
      />
    </section>
  );
}
function Creator({ full = false }: { full?: boolean }) {
  const { locale } = useI18n();
  const m = messages[locale];
  return (
    <section className="section section-wrap av-creator">
      <div>
        <p className="eyebrow">{m.creator}</p>
        <h2>{creatorName[locale]}</h2>
        <p className="av-creator-role">{m.creatorRole}</p>
        <p>{m.creatorBody}</p>
        <a
          className="button button-solid"
          href={brandHref(full ? "/contact" : "/portfolio")}
        >
          {full ? m.email : m.portfolio}
          <Icon name="arrow" directional />
        </a>
        <a className="text-link studio-resume-link" href="/documents/MohammadAmin_Sadeghi_Resume.pdf" download="MohammadAmin_Sadeghi_Resume.pdf"><Icon name="book" />{locale === 'fa' ? 'دانلود رزومه — PDF' : 'Download résumé — PDF'}</a>
      </div>
      <div className="av-creator-note">
        <CreatorSignature />
        <p>
          {locale === "fa"
            ? "رویکردی که از ساختمان موجود شروع می‌شود: فضا، مدل، هماهنگی و مستنداتی که قابل خواندن و بررسی باشند."
            : portfolio.profile.aboutLead}
        </p>
        <p className="eyebrow">
          {tr(portfolio.profile.location, locale)} / ARCHVANTA
        </p>
      </div>
    </section>
  );
}
function Experience() {
  const { locale } = useI18n();
  const m = messages[locale];
  return (
    <section className="section section-wrap">
      <h2>{m.credentials}</h2>
      <div className="av-experience">
        {portfolio.experience.map((e) => (
          <article key={e.org}>
            <p className="eyebrow">{tr(e.org, locale)}</p>
            <h3>{tr(e.role, locale)}</h3>
            <ul>
              {e.duties.map((d) => (
                <li key={d} dir="auto">
                  {tr(d, locale)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="av-skills">
        {portfolio.skillGroups.map((group) => (
          <div key={group.title}>
            <h3>{tr(group.title, locale)}</h3>
            <p>{group.items.map((v) => tr(v, locale)).join(" · ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function Process() {
  const { locale } = useI18n();
  const m = messages[locale];
  const names =
    locale === "fa"
      ? ["شناخت", "مدل‌سازی", "هماهنگی", "بررسی", "ارائه"]
      : ["Discover", "Model", "Coordinate", "Verify", "Present"];
  return (
    <section id="process" className="section section-wrap av-process">
      <p className="eyebrow">ARCHVANTA / PROCESS</p>
      <h2>{m.processLabel}</h2>
      <ol>
        {names.map((name, i) => (
          <li key={name}>
            <span>0{i + 1}</span>
            <h3>{name}</h3>
            <p>
              {locale === "fa"
                ? [
                    "شناخت ساختمان، نیازها و محدودیت‌های واقعی.",
                    "مدل‌سازی با ابعاد و روابط روشن.",
                    "هماهنگی فضا، تجهیزات و اطلاعات.",
                    "بررسی دسترسی، تداخل و منابع.",
                    "ارائهٔ مدل و مستندات خوانا.",
                  ][i]
                : [
                    "Understand the existing building, brief and constraints.",
                    "Model space and equipment at real dimensions.",
                    "Coordinate architecture, equipment and information.",
                    "Check access, clashes and source information.",
                    "Communicate through clear models and documentation.",
                  ][i]}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
function NewsPreview({ insights = false }: { insights?: boolean }) {
  const data = useData();
  const { locale } = useI18n();
  const m = messages[locale];
  const res = useAsync(async () => {
    const idx = await data.archiveIndex();
    const [day, picks] = await Promise.all([
      idx?.days[0] ? data.day(idx.days[0].day) : null,
      data.picks(),
    ]);
    const latest = sortNewestFirst(day?.articles || []);
    return uniqueById([...pickHeroStories(latest, picks, 3), ...latest])
      .filter(
        (a) =>
          !insights ||
          /architect|infrastructure|data cent|BIM|research/i.test(
            `${a.title} ${a.excerpt}`,
          ),
      )
      .slice(0, 3);
  }, [data, insights]);
  return (
    <section className="av-news-preview">
      <div className="container">
        <div className="av-section-top">
          <div>
            <p className="eyebrow">ARCHVANTA / FRONTIER</p>
            <h2>
              {insights
                ? locale === "fa"
                  ? "بینش و پژوهش"
                  : "Insights & research"
                : m.news}
            </h2>
            <p>{m.newsBody}</p>
          </div>
          <a
            className="btn is-primary"
            href={href(insights ? "/explore" : "/")}
          >
            {m.allNews}
            <Icon name="arrow" directional />
          </a>
        </div>
        {res.status === "loading" ? (
          <Loading rows={1} />
        ) : res.status === "error" ? (
          <ErrorState onRetry={res.reload} />
        ) : res.data.length ? (
          <div className="av-news-grid">
            {res.data.map((a) => (
              <StoryCard
                key={a.id}
                article={a}
                variant="tile"
                still
                headingLevel={3}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              locale === "fa"
                ? "خبری در این موضوع پیدا نشد."
                : "No matching stories in the current feed."
            }
          />
        )}
      </div>
    </section>
  );
}
function LabOverview({ short = false }: { short?: boolean }) {
  const { locale } = useI18n();
  const m = messages[locale];
  return (
    <section className="section section-wrap">
      <div className="av-section-top">
        <div>
          <p className="eyebrow">ARCHVANTA / DIGITAL LAB</p>
          <h2>{m.lab}</h2>
        </div>
        {short && (
          <a className="text-link" href={brandHref("/lab")}>
            {locale === "fa" ? "همهٔ ابزارها" : "All tools"}
            <Icon name="arrow" directional />
          </a>
        )}
      </div>
      <div className="av-lab-grid">
        {portfolio.objects.slice(0, short ? 3 : 5).map((obj, i) => (
          <a
            className="av-lab-item"
            key={obj.file}
            href={brandHref("/lab/" + obj.file)}
          >
            <span className="eyebrow">
              {locale === "fa"
                ? "مدل تعاملی / پورتفولیو"
                : "INTERACTIVE MODEL / PORTFOLIO"}
            </span>
            <Icon
              name={i === 1 ? "server" : i === 2 ? "chip" : "box"}
              size={36}
            />
            <LabSchematic variant={i} />
            <h3>{tr(obj.title, locale)}</h3>
            <p>
              {locale === "fa"
                ? "مدل مستقل با امکان بررسی و خروجی‌گرفتن؛ از ابزارهای پورتفولیوی اصلی."
                : obj.description}
            </p>
            <span className="text-link">
              {m.modelOpen}
              <Icon name="arrow" directional />
            </span>
          </a>
        ))}
      </div>
      {!short && (
        <div className="av-platforms">
          {portfolio.home.platforms.items.map((item) => (
            <article key={item.name}>
              <p className="eyebrow">
                {locale === "fa"
                  ? "پروژهٔ دیجیتال / دموی خارجی"
                  : "DIGITAL PROJECT / EXTERNAL DEMO"}
              </p>
              <h3>{item.name}</h3>
              <p>{tr(item.body, locale)}</p>
              <ul>
                {item.features.map((f) => (
                  <li key={f} dir="auto">
                    {tr(f, locale)}
                  </li>
                ))}
              </ul>
              <a
                className="btn"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {locale === "fa" ? "باز کردن پروژه" : "Open project"}
                <Icon name="external" />
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
function ModelView({ slug }: { slug?: string }) {
  const { locale } = useI18n();
  const m = messages[locale];
  const obj = portfolio.objects.find((o) => o.file === slug);
  const [load, setLoad] = useState(false);
  return (
    <>
      <PageTitle
        label="ARCHVANTA / LAB"
        title={
          obj
            ? tr(obj.title, locale)
            : locale === "fa"
              ? "مدل پیدا نشد"
              : "Model not found"
        }
        body={m.modelDisclaimer}
      />
      {obj && (
        <div className="section-wrap av-model-view">
          {load ? (
            <iframe
              title={obj.title}
              src={`/work-media/models/${obj.file}.html`}
              sandbox="allow-scripts allow-downloads"
              allow="fullscreen"
            />
          ) : (
            <button className="av-model-launch" onClick={() => setLoad(true)}>
              <Icon name="box" size={60} />
              <span>{m.launchModel}</span>
              <small>{m.modelDisclaimer}</small>
            </button>
          )}
          <a href={brandHref("/lab")} className="text-link">
            {m.lab}
            <Icon name="arrow" back />
          </a>
        </div>
      )}
    </>
  );
}
function Projects({ category = "all" }: { category?: string }) {
  const { locale } = useI18n();
  const m = messages[locale];
  return (
    <>
      <PageTitle
        label="ARCHVANTA / PORTFOLIO"
        title={m.projects}
        body={m.selectedBody}
      />
      <section className="section-wrap av-projects-page">
        <div className="work-filters" role="group" aria-label={m.projects}>
          {categories.map((c) => (
            <a
              key={c.id}
              href={brandHref("/projects", {
                category: c.id === "all" ? undefined : c.id,
              })}
              aria-current={category === c.id ? "page" : undefined}
            >
              {c[locale]}
              <span className="studio-filter-count">{projectCatalog(locale).filter(p => projectMatches(p, c.id)).length}</span>
            </a>
          ))}
        </div>
        <ProjectCards
          items={projectCatalog(locale).filter((p) =>
            projectMatches(p, category),
          )}
        />
      </section>
    </>
  );
}
function ProjectDetail({ slug }: { slug?: string }) {
  const { locale } = useI18n();
  const m = messages[locale];
  const p = projectCatalog(locale).find((p) => p.slug === slug);
  const [active, setActive] = useState<PortfolioImage | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (active) dialog.current?.showModal();
    else dialog.current?.close();
  }, [active]);
  if (!p)
    return (
      <PageTitle
        label="ARCHVANTA"
        title={locale === "fa" ? "پروژه پیدا نشد" : "Project not found"}
      />
    );
  const gallery = p.source
    ? [...(p.source.gallery || []), ...(p.source.boards?.items || [])]
    : [{ src: p.concept!.detailImage, label: p.title }];
  const proposal = p.source?.proposal;
  return (
    <>
      <PageTitle
        label={`ARCHVANTA / ${p.category}`}
        title={p.title}
        body={p.summary}
      />
      <section className="section-wrap av-project-detail">
        <p className="av-provenance">
          {p.kind === "concept" ? m.concept : m.source} · {p.status}
        </p>
        <img
          className="av-project-lead"
          src={p.cover}
          alt={p.title}
          width="1200"
          height="850"
        />
        <div className="av-project-description">
          <div>
            <h2>{m.overview}</h2>
            <p dir="auto">
              {p.source
                ? tr(p.source.overview || p.source.summary, locale)
                : p.concept?.statement[locale]}
            </p>
            {p.source &&
              (["challenge", "approach", "solution", "learned"] as const).map(
                (key) =>
                  p.source?.[key] && (
                    <div key={key}>
                      <h3>{m[key]}</h3>
                      <p dir="auto">{tr(p.source[key], locale)}</p>
                    </div>
                  ),
              )}
            {!!p.source?.deliver?.length && <div className="project-deliverables"><h3>{locale === 'fa' ? 'خروجی‌های پروژه' : 'Project deliverables'}</h3><ul>{p.source.deliver.map(item => <li key={item}>{tr(item, locale)}</li>)}</ul></div>}
          </div>
          <dl>
            <dt>{m.status}</dt>
            <dd>{p.status}</dd>
            {p.source?.year && <><dt>{locale === 'fa' ? 'سال' : 'Year'}</dt><dd>{p.source.year}</dd></>}
            {p.source?.type && <><dt>{locale === 'fa' ? 'نوع پروژه' : 'Project type'}</dt><dd>{tr(p.source.type, locale)}</dd></>}
            {p.source?.timeline && <><dt>{locale === 'fa' ? 'بازهٔ زمانی' : 'Timeline'}</dt><dd>{tr(p.source.timeline, locale)}</dd></>}
            {p.source?.role && (
              <>
                <dt>{m.role}</dt>
                <dd dir="auto">{tr(p.source.role, locale)}</dd>
              </>
            )}
            {p.source?.credit && (
              <>
                <dt>{locale === "fa" ? "اعتبار و همکاری" : "Credits"}</dt>
                <dd>{tr(p.source.credit, locale)}</dd>
              </>
            )}
            {p.source?.tools && (
              <>
                <dt>{m.tools}</dt>
                <dd dir="auto">{p.source.tools.join(" / ")}</dd>
              </>
            )}
            {p.source?.facts?.map(([key, value]) => (
              <div key={key}>
                <dt>{tr(key, locale)}</dt>
                <dd dir="auto">{tr(value, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>
        {p.source?.model && (
          <a
            className="button button-solid"
            href={brandHref("/lab/" + p.source.model)}
          >
            {m.modelOpen}
            <Icon name="box" />
          </a>
        )}
        {gallery.length > 0 && (
          <>
            <h2>{m.gallery}</h2>
            {p.source?.boards?.title && <p className="project-boards-title">{tr(p.source.boards.title, locale)}</p>}
            <div className="av-gallery">
              {gallery.map((image, i) => (
                <figure key={`${image.src}:${i}`}>
                  <button
                    onClick={() => setActive(image)}
                    aria-label={`${locale === "fa" ? "بزرگ‌نمایی" : "Enlarge"}: ${tr(image.label, locale)}`}
                  >
                    <img
                      src={image.src}
                      alt={tr(image.caption || image.label, locale)}
                      width="1000"
                      height="750"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                  <figcaption>
                    {tr(image.label, locale)}{" "}
                    {image.caption && "— " + tr(image.caption, locale)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
        {proposal && (
          <details className="av-proposal" open style={{ '--proposal-ratio': proposal.ratio } as CSSProperties}>
            <summary>
              {tr(proposal.label || "Design proposal", locale)} ·{" "}
              {proposal.pages} {locale === "fa" ? "صفحه" : "pages"}
            </summary>
            <div>
              {Array.from({ length: proposal.pages }, (_, i) => (
                <figure key={i}>
                  <button
                    onClick={() =>
                      setActive({
                        src: `/work-media/images/pp-${slug}-${String(i + 1).padStart(2, "0")}.webp`,
                        label: `${i + 1} / ${proposal.pages}`,
                      })
                    }
                  >
                    <img
                      src={`/work-media/images/pp-${slug}-${String(i + 1).padStart(2, "0")}.webp`}
                      alt={`${p.title} — ${locale === "fa" ? "صفحه" : "page"} ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      width="900"
                      height="1200"
                    />
                  </button>
                  <figcaption>
                    {i + 1} / {proposal.pages}
                  </figcaption>
                </figure>
              ))}
            </div>
          </details>
        )}
        <a className="button button-solid" href={brandHref("/projects")}>
          {m.back}
          <Icon name="arrow" back />
        </a>
        <h2 className="av-related-title">{m.related}</h2>
        <ProjectCards
          items={projectCatalog(locale)
            .filter((other) => other.slug !== p.slug && other.kind === p.kind)
            .slice(0, 3)}
        />
      </section>
      <dialog
        ref={dialog}
        className="av-lightbox"
        aria-label={m.gallery}
        onCancel={() => setActive(null)}
        onClose={() => setActive(null)}
      >
        <button
          className="av-lightbox-close"
          onClick={() => setActive(null)}
          aria-label={m.close}
        >
          <Icon name="close" />
        </button>
        {active && (
          <figure>
            <img
              src={active.src}
              alt={tr(active.caption || active.label, locale)}
            />
            <figcaption>{tr(active.label, locale)}</figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
function ExpertisePages({ slug }: { slug?: string }) {
  const { locale } = useI18n();
  const m = messages[locale];
  const e = expertise.find(
    (e) =>
      e.id === slug || (slug === "data-centers" && e.id === "infrastructure"),
  );
  return (
    <>
      <PageTitle
        label="ARCHVANTA / EXPERTISE"
        title={e ? e.title[locale] : m.expertise}
        body={e?.body[locale]}
      />
      {e ? (
        <>
          <div className="section-wrap av-expertise-detail">
            <p>{e.body[locale]}</p>
            <ul>
              {portfolio.skillGroups
                .filter((group) =>
                  e.id === "architecture"
                    ? group.title === "Architecture"
                    : e.id === "infrastructure"
                      ? group.title === "Data center"
                      : true,
                )
                .map((group) => (
                  <li key={group.title}>
                    <h2>{tr(group.title, locale)}</h2>
                    <p>{group.items.map((v) => tr(v, locale)).join(" · ")}</p>
                  </li>
                ))}
            </ul>
            <a
              className="button button-solid"
              href={brandHref("/projects", {
                category:
                  e.id === "architecture"
                    ? "architecture"
                    : e.id === "infrastructure"
                      ? "data-centers"
                      : e.id === "bim"
                        ? "bim"
                        : undefined,
              })}
            >
              {m.projects}
              <Icon name="arrow" directional />
            </a>
          </div>
          <Systems />
        </>
      ) : (
        <Expertise />
      )}
    </>
  );
}
export default function BrandPages({ route }: { route: BrandRoute }) {
  useReveal();
  const { locale } = useI18n();
  const m = messages[locale];
  if (route.page === "search")
    return <GlobalSearchPage params={route.params} />;
  return (
    <div className="av-brand">
      {route.page === "home" ? (
        <>
          <ParallaxComponent />
          <Expertise />
          <Systems />
          <LabOverview short />
          <DigitalProjects />
          <Creator />
          <NewsPreview />
          <Process />
          <SelectedWork />
          <Contact />
        </>
      ) : route.page === "projects" ? (
        <Projects category={route.params.get("category") || "all"} />
      ) : route.page === "project" ? (
        <ProjectDetail slug={route.slug} />
      ) : route.page === "expertise" ? (
        <ExpertisePages slug={route.slug} />
      ) : route.page === "lab" ? (
        <>
          <PageTitle label="ARCHVANTA / DIGITAL LAB" title={m.lab} />
          <LabOverview />
          <DigitalProjects />
        </>
      ) : route.page === "model" ? (
        <ModelView slug={route.slug} />
      ) : route.page === "contact" ? (
        <>
          <PageTitle
            label="ARCHVANTA / CONTACT"
            title={m.email}
            body={m.contactBody}
          />
          <Contact />
        </>
      ) : (
        <>
          <PageTitle
            label="ARCHVANTA / PEOPLE"
            title={route.page === "portfolio" ? creatorName[locale] : m.about}
          />
          {route.page === "about" && <About />}
          <Creator full />
          <Experience />
          <DigitalProjects />
          <SelectedWork />
          <Process />
        </>
      )}
    </div>
  );
}
