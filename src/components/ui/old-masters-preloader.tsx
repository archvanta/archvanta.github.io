"use client";

import { useEffect, useId, useRef, useState } from "react";
import { expertise } from "../../brand/lib/content";
import { useI18n } from "../../lib/i18n";
import { useMotionMode } from "../../lib/motion";
import { brandHref } from "../../lib/unifiedRouter";
import { BrandGlyph, PerspectiveMark } from "../BrandGlyph";
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

/** Permanent statue scene: normal scrolling preserves it on every return to the top. */
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

  const skip = () => root.current?.nextElementSibling?.scrollIntoView({ behavior: motion === "full" ? "smooth" : "auto", block: "start" });
  const loadingLabel = locale === "fa" ? "آماده‌سازی صحنه" : "Preparing the scene";

  return (
    <section
      ref={root}
      className="old-masters-preloader av-opening"
      data-ready={ready === 100 ? "true" : "false"}
      data-motion={motion}
      aria-labelledby="home-title"
    >
      <div className="om-opening-stage">
        <div className="om-opening-top">
          <span>ARCHVANTA</span>
          <button type="button" onClick={skip}>
            {locale === "fa" ? "رفتن به پروژه‌ها" : "Skip to projects"} <span aria-hidden="true">↓</span>
          </button>
        </div>

        <div className="om-opening-intro">
          <svg className="om-opening-ring" viewBox="0 0 400 400" aria-hidden="true">
            <circle cx="200" cy="200" r="198" />
            <circle cx="200" cy="200" r="154" />
            <path d={ring} />
          </svg>
          <h1 id="home-title" className="om-opening-outline" lang="en" dir="ltr">
            ARCHVANTA
            <span aria-hidden="true" style={{ clipPath: `inset(${100 - ready}% 0 0)` }}>ARCHVANTA</span>
          </h1>
          <svg width="0" height="0" aria-hidden="true">
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

      </div>
        <div className="om-opening-system">
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
    </section>
  );
}
