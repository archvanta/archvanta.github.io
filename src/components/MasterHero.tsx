import { useEffect, useRef } from "react";
import { useI18n } from "../lib/i18n";
import { useMotionMode } from "../lib/motion";
import { brandHref } from "../lib/unifiedRouter";
import { HalftoneWordmark } from "./HalftoneWordmark";
import { Icon } from "./Icon";
import { iconArt } from "../lib/iconArt";
export function MasterHero() {
  const { locale } = useI18n();
  const mode = useMotionMode();
  const film = useRef<HTMLVideoElement>(null),
    root = useRef<HTMLElement>(null);
  useEffect(() => {
    const video = film.current,
      el = root.current;
    if (!video || !el) return;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (entry?.isIntersecting && mode === "full" && !document.hidden)
        timer = window.setTimeout(
          () => void video.play().catch(() => undefined),
          650,
        );
      else video.pause();
    });
    io.observe(el);
    const visibility = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      video.pause();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [mode]);
  const entries = [
    {
      key: "ai-games",
      to: "/expertise/architecture",
      art: "architecture" as const,
      en: "Architecture",
      fa: "معماری",
      descEn: "Space, structure & perspective",
      descFa: "فضا، ساختار و زاویهٔ نگاه",
    },
    {
      key: "data-centers",
      to: "/expertise/bim",
      art: "models" as const,
      en: "BIM & digital design",
      fa: "BIM و طراحی دیجیتال",
      descEn: "Information, coordinated",
      descFa: "اطلاعات، در هماهنگی",
    },
    {
      key: "architecture",
      to: "/expertise/infrastructure",
      art: "data-centers" as const,
      en: "Data centers",
      fa: "دیتاسنترها",
      descEn: "Infrastructure, considered",
      descFa: "زیرساخت، سنجیده",
    },
    {
      key: "ai-news",
      to: "/lab",
      art: "products" as const,
      en: "Digital Lab",
      fa: "آزمایشگاه دیجیتال",
      descEn: "Experiments that become tools",
      descFa: "تجربه‌هایی که ابزار می‌شوند",
    },
  ];
  return (
    <section
      ref={root}
      className="home-intro av-master"
      aria-labelledby="home-title"
    >
      <div className="container hi-inner">
        <div className="hi-bento">
          <div className="hi-primary-card">
            <video
              ref={film}
              className="hi-hero-video"
              muted
              loop
              playsInline
              preload="none"
              poster="/media/frontier-hero-poster.webp"
              aria-hidden="true"
            >
              <source src="/media/frontier-hero.mp4" type="video/mp4" />
            </video>
            <span className="hi-hero-scrim" aria-hidden="true" />
            <p className="hi-kicker">
              {locale === "fa"
                ? "معماری / زیرساخت / هوشمندی دیجیتال"
                : "ARCHITECTURE / INFRASTRUCTURE / DIGITAL INTELLIGENCE"}
            </p>
            <h1 id="home-title" className="hi-title" lang="en" dir="ltr">
              <HalftoneWordmark word="ARCHVANTA" />
            </h1>
            <div className="hi-hero-copy">
              <p className="hi-body">
                {locale === "fa"
                  ? "طراحی فضا. مهندسی آینده. نگاهی تازه به معماری، زیرساخت و سیستم‌های دیجیتال."
                  : "Designing Space. Engineering the Future. A new perspective on architecture, infrastructure and digital systems."}
              </p>
              <a className="hi-join" href={brandHref("/projects")}>
                <span>
                  {locale === "fa" ? "کشف پروژه‌ها" : "Explore projects"}
                </span>
                <i>
                  <Icon name="arrow" directional />
                </i>
              </a>
              <a className="av-discover" href={brandHref("/about")}>
                {locale === "fa" ? "آشنایی با آرک‌ونتا" : "Discover ARCHVANTA"}{" "}
                <Icon name="arrow" directional size={14} />
              </a>
            </div>
          </div>
          <nav
            className="hi-links"
            aria-label={
              locale === "fa" ? "حوزه‌های آرک‌ونتا" : "ARCHVANTA disciplines"
            }
          >
            {entries.map((e) => (
              <a
                key={e.key}
                className="hi-link"
                href={brandHref(e.to)}
                data-entry={e.key}
              >
                <img
                  className="hi-link-art"
                  src={iconArt(e.art)}
                  width="42"
                  height="42"
                  alt=""
                  decoding="async"
                />
                <span className="hi-link-label">
                  {locale === "en" ? e.en : e.fa}
                </span>
                <span className="hi-link-desc">
                  {locale === "en" ? e.descEn : e.descFa}
                </span>
                <span className="hi-link-count" aria-hidden="true">
                  ARCHVANTA / {entries.indexOf(e) + 1}
                </span>
                <Icon name="arrow" directional size={14} />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
