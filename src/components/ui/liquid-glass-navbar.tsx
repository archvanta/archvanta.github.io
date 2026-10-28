"use client";

/** CSS adaptation of Nimbus Liquid Navbar / Waterline by guglielmogiannattasio.it. */

import * as React from "react";
import "./liquid-glass-navbar.css";

export type NimbusFx = "plane" | "drop" | "spin" | "glow" | "wave" | "pop" | "none";

export type LiquidNavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  render?: () => React.ReactNode;
  fx?: NimbusFx;
};

export type LiquidNavbarProps = {
  ariaLabel?: string;
  items?: LiquidNavItem[];
  defaultActive?: number;
  active?: number;
  onChange?: (index: number, item: LiquidNavItem) => void;
  tone?: "light" | "dark";
  compact?: boolean;
  sound?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const icon = (content: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {content}
  </svg>
);

export const NimbusIcons = {
  home: icon(<><path d="M3.5 11.2 12 4l8.5 7.2" /><path d="M6 9.6V20h12V9.6" /><path d="M10 20v-5h4v5Z" /></>),
  globe: icon(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" /></>),
  plane: icon(<path d="M21 12.2 3.6 5.4l2.7 6.8-2.7 6.4L21 12.2Zm-14.7 0H13" />),
  drop: icon(<path d="M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z" />),
  user: icon(<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5" /></>),
};

const DEFAULT_ITEMS: LiquidNavItem[] = [
  { label: "Home", icon: NimbusIcons.home },
  { label: "Explore", icon: NimbusIcons.globe },
  { label: "Flights", icon: NimbusIcons.plane },
  { label: "Weather", icon: NimbusIcons.drop },
  { label: "Profile", icon: NimbusIcons.user },
];

/** Stable glass navigation with one short, measured active transition. */
export function LiquidNavbar({
  ariaLabel = "Main navigation",
  items = DEFAULT_ITEMS,
  defaultActive = 0,
  active,
  onChange,
  tone = "light",
  compact,
  className,
  style,
}: LiquidNavbarProps) {
  const [inner, setInner] = React.useState(defaultActive);
  const current = active ?? inner;
  const root = React.useRef<HTMLElement>(null);

  const measure = React.useCallback(() => {
    const nav = root.current;
    if (!nav) return;
    const rendered = nav.querySelectorAll<HTMLElement>(".nimbus-item");
    const selected = current >= 0 ? rendered[current] : undefined;
    if (!selected) {
      nav.style.setProperty("--n-o", "0");
      return;
    }
    const outer = nav.getBoundingClientRect();
    const rect = selected.getBoundingClientRect();
    nav.style.setProperty("--n-x", `${rect.left - outer.left}px`);
    nav.style.setProperty("--n-y", `${rect.top - outer.top}px`);
    nav.style.setProperty("--n-w", `${rect.width}px`);
    nav.style.setProperty("--n-h", `${rect.height}px`);
    nav.style.setProperty("--n-o", "1");
  }, [current]);

  React.useLayoutEffect(measure, [measure, items.length, compact, tone]);
  React.useEffect(() => {
    const nav = root.current;
    if (!nav) return;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(nav);
    void document.fonts?.ready.then(measure);
    return () => observer?.disconnect();
  }, [measure]);

  const choose = (index: number) => {
    const item = items[index];
    if (!item) return;
    if (active === undefined) setInner(index);
    onChange?.(index, item);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if ((event.target as HTMLElement).closest(".nav-panel")) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const nav = root.current;
    if (!nav) return;
    const all = Array.from(nav.querySelectorAll<HTMLElement>(".nimbus-item"));
    const at = all.indexOf(document.activeElement as HTMLElement);
    const rtl = getComputedStyle(nav).direction === "rtl";
    const step = (event.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
    const next = (Math.max(0, at) + step + all.length) % all.length;
    event.preventDefault();
    all[next]?.focus();
  };

  return (
    <nav ref={root} className={["nimbus-nav", className].filter(Boolean).join(" ")} data-tone={tone} data-compact={compact === undefined ? undefined : String(compact)} aria-label={ariaLabel} onKeyDown={onKeyDown} style={style}>
      <span className="nimbus-glass" aria-hidden="true" />
      <span className="nimbus-drop" aria-hidden="true" />
      <ul className="nimbus-list">
        {items.map((item, index) => {
          if (item.render) return <React.Fragment key={item.label}>{item.render()}</React.Fragment>;
          const content = <>{item.icon && <span className="nv-ico">{item.icon}</span>}<span className="nimbus-label">{item.label}</span></>;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href ? (
                <a className="nimbus-item" href={item.href} aria-current={index === current ? "page" : undefined} onClick={() => choose(index)}>{content}</a>
              ) : (
                <button className="nimbus-item" type="button" aria-pressed={index === current} onClick={() => choose(index)}>{content}</button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { LiquidNavbar as Component };
export default LiquidNavbar;
