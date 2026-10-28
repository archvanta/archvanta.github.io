"use client";

// Adapted from the user-supplied Old Masters Preloader: marble cast, outlined
// wordmark, Greek meander and curtain reveal. Local assets; no font injection,
// dust canvas, pointer parallax or perpetual frame loop on the page behind it.
import { useEffect, useRef, useState, useId } from "react";
import "./old-masters-preloader.css";

export interface OldMastersPreloaderProps {
  wordmark?: string;
  loadingLabel?: string;
  skipLabel?: string;
  tagline?: string;
  onComplete: () => void;
}

function meander() {
  const hook = [
    [0, 0],
    [0, 3],
    [4, 3],
    [4, 2],
    [2, 2],
    [2, 0],
    [6, 0],
  ] as const;
  let path = "",
    previous = 0;
  for (let i = 0; i < 32; i++)
    for (let k = 0; k < hook.length; k++) {
      if (i && !k) continue;
      const [u, v] = hook[k]!;
      const angle = -Math.PI / 2 + ((i + u / 6) * Math.PI) / 16;
      const r = 176 + (v / 3 - 0.5) * 22;
      const x = +(200 + Math.cos(angle) * r).toFixed(2),
        y = +(200 + Math.sin(angle) * r).toFixed(2);
      path +=
        !i && !k
          ? `M${x} ${y}`
          : previous === v
            ? ` A${r} ${r} 0 0 1 ${x} ${y}`
            : ` L${x} ${y}`;
      previous = v;
    }
  return path;
}
const ring = meander();
const figures = ["hercules", "apollo", "flowers"];
export default function OldMastersPreloader({
  wordmark = "ARCHVANTA",
  loadingLabel = "Preparing the scene",
  skipLabel = "Skip introduction",
  tagline = "Designing Space. Engineering the Future.",
  onComplete,
}: OldMastersPreloaderProps) {
  const maskId = useId().replace(/:/g, "");
  const dialog = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(0);
  const [phase, setPhase] = useState<"load" | "reveal">("load");
  const complete = useRef(onComplete);
  useEffect(() => {
    complete.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let live = true;
    let completed = 0;
    const settled = () => {
      if (live) {
        completed++;
        setReady(Math.round((completed / 4) * 100));
      }
    };
    const images = figures.map((name) => {
      const image = new Image();
      image.onload = settled;
      image.onerror = settled;
      image.src = `/images/entrance/${name}.webp`;
      return image;
    });
    void (document.fonts?.ready ?? Promise.resolve()).then(settled);
    // Failed or stalled media must never trap the visitor.
    const fallback = window.setTimeout(() => setReady(100), 1600);
    const visibility = () => {
      if (document.hidden) complete.current();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      live = false;
      clearTimeout(fallback);
      images.forEach((image) => {
        image.onload = image.onerror = null;
      });
      document.removeEventListener("visibilitychange", visibility);
      document.body.style.overflow = before;
      node?.close();
    };
  }, []);
  useEffect(() => {
    if (ready < 100) return;
    const reveal = window.setTimeout(() => setPhase("reveal"), 350);
    const done = window.setTimeout(() => complete.current(), 1600);
    return () => {
      clearTimeout(reveal);
      clearTimeout(done);
    };
  }, [ready]);
  return (
    <dialog
      ref={dialog}
      className="old-masters-preloader"
      data-phase={phase}
      aria-label={`${wordmark} — ${loadingLabel}`}
      onCancel={(e) => {
        e.preventDefault();
        onComplete();
      }}
    >
      <div className="om-intro-scenery" aria-hidden="true">
        <span className="om-intro-flood" />
        <svg className="om-intro-ring" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="198" />
          <circle cx="200" cy="200" r="154" />
          <path d={ring} />
        </svg>
        <p className="om-intro-word" lang="en" dir="ltr" data-word={wordmark}>
          {wordmark}
          <span style={{ clipPath: `inset(${100 - ready}% 0 0)` }}>
            {wordmark}
          </span>
        </p>
        <svg width="0" height="0" aria-hidden="true">
          <defs>
            <filter id={maskId + "key"} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0"
              />
              <feComponentTransfer>
                <feFuncR type="linear" slope="8" intercept="-0.32" />
                <feFuncG type="linear" slope="8" intercept="-0.32" />
                <feFuncB type="linear" slope="8" intercept="-0.32" />
              </feComponentTransfer>
            </filter>
            {figures.map((name) => (
              <mask
                key={name}
                id={maskId + name}
                maskUnits="objectBoundingBox"
                maskContentUnits="objectBoundingBox"
                style={{ maskType: "luminance" }}
              >
                <image
                  href={`/images/entrance/${name}.webp`}
                  width="1"
                  height="1"
                  preserveAspectRatio="none"
                  filter={`url(#${maskId}key)`}
                />
              </mask>
            ))}
          </defs>
        </svg>
        <div className="om-intro-cast">
          {figures.map((name) => (
            <img
              key={name}
              data-figure={name}
              style={{ mask: `url(#${maskId + name})` }}
              src={`/images/entrance/${name}.webp`}
              width="500"
              height="700"
              alt=""
              decoding="async"
            />
          ))}
        </div>
      </div>
      <div className="om-intro-top">
        <span>ARCHVANTA</span>
        <button type="button" onClick={onComplete} autoFocus>
          {skipLabel} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="om-intro-eyebrow" lang="en" dir="ltr">
        ARCHITECTURE / INFRASTRUCTURE / DIGITAL INTELLIGENCE
      </p>
      <div className="om-intro-bottom">
        <p>{tagline}</p>
        <div
          role="progressbar"
          aria-label={loadingLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ready}
        >
          <strong>{String(ready).padStart(2, "0")}</strong>
          <span>{loadingLabel}</span>
        </div>
      </div>
    </dialog>
  );
}
