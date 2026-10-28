"use client";

// Adapted from the user-supplied 21st.dev CircularTestimonials component.
// ARCHVANTA uses the image composition for sourced project stories, never invented endorsements.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useMotionMode } from "../../lib/motion";
import "./circular-testimonials.css";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}
interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}
interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}
export interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
  ariaLabel?: string;
  labels?: { previous: string; next: string; pause: string; play: string };
  renderAction?: (item: Testimonial, index: number) => ReactNode;
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
  ariaLabel = "Selected stories",
  labels = {
    previous: "Previous story",
    next: "Next story",
    pause: "Pause slideshow",
    play: "Play slideshow",
  },
  renderAction,
}: CircularTestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(!document.hidden);
  const root = useRef<HTMLElement>(null);
  const mode = useMotionMode();
  const count = testimonials.length;
  const activeIndex = count ? index % count : 0;
  const active = testimonials[activeIndex];
  const change = useCallback(
    (step: number) => setIndex((i) => (count ? (i + step + count) % count : 0)),
    [count],
  );

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
            { threshold: 0.15 },
          );
    io?.observe(node);
    const onVisibility = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  useEffect(() => {
    if (
      !autoplay ||
      paused ||
      interacting ||
      !visible ||
      !foreground ||
      mode !== "full" ||
      count < 2
    )
      return;
    const timer = window.setInterval(() => change(1), 6500);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, interacting, visible, foreground, mode, count, change]);
  if (!active) return null;
  const custom = {
    "--ct-name": colors.name,
    "--ct-designation": colors.designation,
    "--ct-quote": colors.testimony,
    "--ct-arrow-bg": colors.arrowBackground,
    "--ct-arrow-fg": colors.arrowForeground,
    "--ct-arrow-hover": colors.arrowHoverBackground,
    "--ct-name-size": fontSizes.name,
    "--ct-designation-size": fontSizes.designation,
    "--ct-quote-size": fontSizes.quote,
  } as CSSProperties;
  return (
    <section
      ref={root}
      className="circular-testimonials"
      style={custom}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false);
      }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        change((e.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1));
      }}
    >
      <div className="ct-images" aria-hidden="true">
        {testimonials.map((item, i) => {
          const offset = (i - activeIndex + count) % count;
          const position =
            i === activeIndex
              ? "center"
              : offset === count - 1
                ? "left"
                : offset === 1
                  ? "right"
                  : "hidden";
          return (
            <img
              key={item.src}
              className="ct-image"
              data-position={position}
              src={item.src}
              alt=""
              width="1000"
              height="750"
              loading="lazy"
              decoding="async"
            />
          );
        })}
      </div>
      <div className="ct-content">
        <LazyMotion features={domAnimation}>
          <m.div
            key={active.src}
            initial={mode === "full" ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            aria-live={autoplay && !paused ? "off" : "polite"}
            aria-atomic="true"
          >
            <p className="ct-designation">{active.designation}</p>
            <h3 className="ct-name">{active.name}</h3>
            <p className="ct-quote">{active.quote}</p>
            {renderAction?.(active, activeIndex)}
          </m.div>
        </LazyMotion>
        {count > 1 && (
          <div className="ct-controls">
            <button
              type="button"
              onClick={() => change(-1)}
              aria-label={labels.previous}
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <span className="ct-counter" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => change(1)}
              aria-label={labels.next}
            >
              <FaArrowRight aria-hidden="true" />
            </button>
            {autoplay && mode === "full" && (
              <button
                type="button"
                className="ct-play"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? labels.play : labels.pause}
              >
                {paused ? "▶" : "Ⅱ"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
export default CircularTestimonials;
