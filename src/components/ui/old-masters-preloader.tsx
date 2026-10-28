"use client";

import { useEffect, useId, useRef, useState } from "react";
import { expertise } from "../../brand/lib/content";
import { useI18n } from "../../lib/i18n";
import { useMotionMode } from "../../lib/motion";
import { brandHref } from "../../lib/unifiedRouter";
import { BrandGlyph, PerspectiveMark } from "../BrandGlyph";
import { HalftoneWordmark } from "../HalftoneWordmark";
import { Icon } from "../Icon";
import "./old-masters-preloader.css";

const figures = ["hercules", "apollo", "flowers"] as const;

function meander() {
  const hook = [[0, 0], [0, 3], [4, 3], [4, 2], [2, 2], [2, 0], [6, 0]] as const;
  let path = "";
  let previous = 0;
  for (let index = 0; index < 32; index++) {
    for (let point = 0; point < hook.length; point++) {
      if (index && !point) continue;
      const [u, v] = hook[point]!;
      const angle = -Math.PI / 2 + ((index + u / 6) * Math.PI) / 16;
      const radius = 176 + (v / 3 - 0.5) * 22;
      const x = +(200 + Math.cos(angle) * radius).toFixed(2);
      const y = +(200 + Math.sin(angle) * radius).toFixed(2);
      path += !index && !point ? `M${x} ${y}` : previous === v ? ` A${radius} ${radius} 0 0 1 ${x} ${y}` : ` L${x} ${y}`;
      previous = v;
    }
  }
  return path;
}

const ring = meander();
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (from: number, to: number, value: number) => {
  const x = clamp((value - from) / (to - from));
  return x * x * (3 - 2 * x);
};

/** The permanent, scroll-driven opening chapter of the ARCHVANTA home page. */
export default function OldMastersOpening() {
  const { locale } = useI18n();
  const motion = useMotionMode();
  const root = useRef<HTMLElement>(null);
  const maskId = useId().replace(/:/g, "");
  const [ready, setReady] = useState(0);

  useEffect(() => {
    let live = true;
    let settledCount = 0;
    const settled = () => {
      if (!live) return;
      settledCount += 1;
      setReady(Math.min(100, Math.round((settledCount / 4) * 100)));
    };
    const images = figures.map((name) => {
      const image = new Image();
      image.onload = settled;
      image.onerror = settled;
      image.src = `/images/entrance/${name}.webp`;
      return image;
    });
    void (document.fonts?.ready ?? Promise.resolve()).then(settled);
    const fallback = window.setTimeout(() => setReady(100), 1600);
    return () => {
      live = false;
      window.clearTimeout(fallback);
      images.forEach((image) => {
        image.onload = image.onerror = null;
      });
    };
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let visible = true;
    let frame = 0;
    const render = () => {
      frame = 0;
      if (!visible) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / distance);
      const introOut = smooth(0.18, 0.36, progress);
      const heroIn = smooth(0.2, 0.38, progress);
      const heroOut = smooth(0.58, 0.74, progress);
      const systemIn = smooth(0.62, 0.8, progress);
      section.style.setProperty("--opening-intro", String(1 - introOut));
      section.style.setProperty("--opening-hero", String(heroIn * (1 - heroOut)));
      section.style.setProperty("--opening-system", String(systemIn));
      section.style.setProperty("--opening-intro-y", `${introOut * -64}px`);
      section.style.setProperty("--opening-hero-y", `${(1 - heroIn) * 56 - heroOut * 38}px`);
      section.style.setProperty("--opening-system-y", `${(1 - systemIn) * 48}px`);
      section.dataset.chapter = progress < 0.28 ? "intro" : progress < 0.69 ? "hero" : "system";
      section.querySelectorAll<HTMLElement>(".om-opening-hero, .om-opening-system").forEach((scene) => {
        scene.inert = motion === "full" && !scene.classList.contains(`om-opening-${section.dataset.chapter}`);
      });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) queue();
    }, { rootMargin: "20% 0px" });
    observer?.observe(section);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    render();
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      cancelAnimationFrame(frame);
    };
  }, [motion]);

  const skip = () => root.current?.nextElementSibling?.scrollIntoView({ behavior: motion === "full" ? "smooth" : "auto", block: "start" });
  const loadingLabel = locale === "fa" ? "آماده‌سازی صحنه" : "Preparing the scene";

  return (
    <section
      ref={root}
      className="old-masters-preloader av-opening"
      data-ready={ready === 100 ? "true" : "false"}
      data-motion={motion}
      data-chapter="intro"
      aria-labelledby="home-title"
    >
      <div className="om-opening-stage">
        <div className="om-opening-top">
          <span>ARCHVANTA</span>
          <button type="button" onClick={skip}>
            {locale === "fa" ? "رفتن به پروژه‌ها" : "Skip to projects"} <span aria-hidden="true">↓</span>
          </button>
        </div>

        <div className="om-opening-intro" aria-hidden="true">
          <svg className="om-opening-ring" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="198" />
            <circle cx="200" cy="200" r="154" />
            <path d={ring} />
          </svg>
          <p className="om-opening-outline" lang="en" dir="ltr">
            ARCHVANTA
            <span style={{ clipPath: `inset(${100 - ready}% 0 0)` }}>ARCHVANTA</span>
          </p>
          <svg width="0" height="0">
            <defs>
              <filter id={`${maskId}key`} colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0" />
                <feComponentTransfer>
                  <feFuncR type="linear" slope="8" intercept="-0.32" />
                  <feFuncG type="linear" slope="8" intercept="-0.32" />
                  <feFuncB type="linear" slope="8" intercept="-0.32" />
                </feComponentTransfer>
              </filter>
              {figures.map((name) => (
                <mask key={name} id={`${maskId}${name}`} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" style={{ maskType: "luminance" }}>
                  <image href={`/images/entrance/${name}.webp`} width="1" height="1" preserveAspectRatio="none" filter={`url(#${maskId}key)`} />
                </mask>
              ))}
            </defs>
          </svg>
          <div className="om-opening-cast">
            {figures.map((name) => (
              <img key={name} data-figure={name} style={{ mask: `url(#${maskId}${name})` }} src={`/images/entrance/${name}.webp`} width="500" height="700" alt="" decoding="async" />
            ))}
          </div>
          <p className="om-opening-tagline">
            {locale === "fa" ? <>طراحی فضا.<br />مهندسی آینده.</> : <>Designing Space.<br />Engineering the Future.</>}
          </p>
          <div className="om-opening-progress" role="progressbar" aria-label={loadingLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready}>
            <strong>{String(ready).padStart(2, "0")}</strong>
            <span>{loadingLabel}</span>
          </div>
        </div>

        <div className="om-opening-hero" inert={motion === "full"}>
          <img src="/media/frontier-hero-poster.webp" alt="" width="1600" height="900" decoding="async" />
          <span className="om-opening-hero-tint" aria-hidden="true" />
          <p className="om-opening-kicker">
            {locale === "fa" ? "معماری / زیرساخت / هوشمندی دیجیتال" : "ARCHITECTURE / INFRASTRUCTURE / DIGITAL INTELLIGENCE"}
          </p>
          <h1 id="home-title" className="om-opening-title" lang="en" dir="ltr">
            <HalftoneWordmark word="ARCHVANTA" />
          </h1>
          <div className="om-opening-copy">
            <p>{locale === "fa" ? "طراحی فضا. مهندسی آینده. نگاهی تازه به معماری، زیرساخت و سیستم‌های دیجیتال." : "Designing Space. Engineering the Future. A new perspective on architecture, infrastructure and digital systems."}</p>
            <a href={brandHref("/projects")} className="om-opening-cta">
              {locale === "fa" ? "کشف پروژه‌ها" : "Explore projects"}
              <span><Icon name="arrow" directional /></span>
            </a>
            <a href={brandHref("/about")} className="om-opening-about">
              {locale === "fa" ? "آشنایی با آرک‌ونتا" : "Discover ARCHVANTA"} <Icon name="arrow" directional size={14} />
            </a>
          </div>
        </div>

        <div className="om-opening-system" inert={motion === "full"}>
          <div className="om-opening-perspective">
            <PerspectiveMark />
            <div>
              <p className="om-opening-kicker">ARCHVANTA / 01</p>
              <h2>{locale === "fa" ? <>زاویهٔ نگاه،<br />همه‌چیز را می‌سازد.</> : <>Perspective defines<br />everything.</>}</h2>
              <p>{locale === "fa" ? "فضا، زیرساخت، اطلاعات و فناوری؛ چهار بخش از یک سیستم واحد." : "Space, infrastructure, information and technology — four parts of one connected system."}</p>
            </div>
          </div>
          <nav className="om-opening-disciplines" aria-label={locale === "fa" ? "حوزه‌های آرک‌ونتا" : "ARCHVANTA disciplines"}>
            {expertise.map((item) => (
              <a key={item.id} href={brandHref(`/expertise/${item.id}`)}>
                <span>{item.number}</span>
                <BrandGlyph mode={item.mode} />
                <strong>{item.title[locale]}</strong>
                <small>{item.tags.slice(0, 2).join(" / ")}</small>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
