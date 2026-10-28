import { useEffect, useRef, useState } from "react";
import { site } from "../lib/content";
import { usePreferences } from "../lib/preferences";
import { Brand } from "./Brand";
import { Icon } from "./Icon";
const sections = ["home", "expertise", "work", "lab", "about", "contact"];
export function Header() {
  const { t, language, setLanguage, theme, toggleTheme } = usePreferences();
  const [open, setOpen] = useState(false),
    [active, setActive] = useState("home");
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -45% 0px", threshold: [0, 0.15, 0.4] },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1000px)");
    const close = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);
  const prefs = (
    <>
      <button
        className="language-button"
        onClick={() => setLanguage(language === "en" ? "fa" : "en")}
        aria-label={
          language === "en"
            ? "فا — تغییر زبان به فارسی"
            : "EN — Switch language to English"
        }
        lang={language === "en" ? "fa" : "en"}
      >
        {language === "en" ? "فا" : "EN"}
      </button>
      <button
        className="icon-button theme-button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? t.light : t.dark}
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
      </button>
    </>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="header-shell">
          <Brand />
          <nav
            className="desktop-nav"
            aria-label={language === "en" ? "Main navigation" : "ناوبری اصلی"}
          >
            {sections.map((id, i) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
              >
                {t.nav[i]}
              </a>
            ))}
          </nav>
          <div className="header-tools">
            {prefs}
            <a
              className="frontier-nav"
              href={site.frontier}
              target="_blank"
              rel="noopener noreferrer"
            >
              FRONTIER
              <Icon name="external" size={13} />
            </a>
            <button
              ref={toggle}
              className="icon-button menu-toggle"
              onClick={() => setOpen(true)}
              aria-label={t.menu}
              aria-haspopup="dialog"
              aria-expanded={open}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="mobile-menu"
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          toggle.current?.focus();
        }}
        aria-label={t.menu}
      >
        <div className="mobile-menu-top">
          <Brand />
          <button
            className="icon-button"
            onClick={() => setOpen(false)}
            aria-label={t.closeMenu}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label={t.menu}>
          {sections.map((id, i) => (
            <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
              <small dir="ltr">0{i + 1}</small>
              {t.nav[i]}
              <Icon name="arrow" />
            </a>
          ))}
          <a href={site.frontier} target="_blank" rel="noopener noreferrer">
            FRONTIER
            <Icon name="external" />
          </a>
        </nav>
        <p className="eyebrow">ARCHITECTURE / INFRASTRUCTURE / DIGITAL</p>
      </dialog>
    </>
  );
}
