import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandMark } from "../brand/components/Brand";
import { useI18n, categoryLabel, categoryDescription } from "../lib/i18n";
import { messages } from "../content/messages";
import { expertise, categories } from "../content/catalog";
import { brandHref, type AppRoute } from "../lib/unifiedRouter";
import { href } from "../lib/router";
import { CATEGORY_IDS } from "../lib/types";
import { NavGroup, LangSwitch, ThemeToggle, type MenuGroup } from "./Header";
import { UserMenu } from "./account/UserMenu";
import { Icon } from "./Icon";
import {
  LiquidNavbar,
  NimbusIcons,
  type LiquidNavItem,
} from "./ui/liquid-glass-navbar";
import { useTheme } from "../lib/theme";
export function GlobalHeader({ route }: { route: AppRoute }) {
  const { theme } = useTheme();
  const { locale, t, setLocale } = useI18n();
  const m = messages[locale];
  const [openGroup, setGroup] = useState<string | null>(null),
    [mobile, setMobile] = useState(false),
    [q, setQ] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    search = useRef<HTMLInputElement>(null),
    root = useRef<HTMLElement>(null);
  useEffect(() => {
    setMobile(false);
    setGroup(null);
  }, [route]);
  useEffect(() => {
    if (mobile) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setGroup(null);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGroup(null);
        setMobile(false);
      }
      if (
        e.key === "/" &&
        !/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", key);
    };
  }, []);
  const groups: MenuGroup[] = [
    {
      id: "expertise",
      label: m.expertise,
      current: route.kind === "brand" && route.page === "expertise",
      items: expertise.map((e) => ({
        glyphMode: e.mode,
        key: e.id,
        to: "/",
        href: brandHref(`/expertise/${e.id}`),
        art:
          e.id === "architecture"
            ? "architecture"
            : e.id === "bim"
              ? "models"
              : e.id === "infrastructure"
                ? "data-centers"
                : "products",
        tone: "blue",
        title: e.title[locale],
        desc: e.body[locale],
        current: route.kind === "brand" && route.slug === e.id,
      })),
    },
    {
      id: "projects",
      label: m.projects,
      current:
        route.kind === "brand" && ["projects", "project"].includes(route.page),
      items: categories.map((c) => ({
        glyphMode: c.id === "data-centers" ? 3 : c.id === "bim" ? 2 : c.id === "urban" ? 1 : 0,
        key: c.id,
        to: "/",
        href: brandHref("/projects", {
          category: c.id === "all" ? undefined : c.id,
        }),
        art:
          c.id === "data-centers"
            ? "data-centers"
            : c.id === "architecture"
              ? "architecture"
              : "products",
        tone: "violet",
        title: c[locale],
        desc: c.id === "concepts" ? m.concept : m.source,
        current:
          route.kind === "brand" && route.params.get("category") === c.id,
      })),
    },
  ];
  const nav = (prefix = "") => (
    <>
      <li>
        <a className="nav-link" href={brandHref("/")}>
          {m.home}
        </a>
      </li>
      {groups.map((g) => (
        <NavGroup
          key={g.id}
          group={{ ...g, id: prefix + g.id }}
          open={openGroup === prefix + g.id}
          onToggle={setGroup}
          onClose={() => setGroup(null)}
        />
      ))}
      <li>
        <a className="nav-link" href={brandHref("/lab")}>
          {m.lab}
        </a>
      </li>
      <li>
        <a
          className="nav-link"
          href={href("/")}
          aria-current={route.kind === "editorial" ? "page" : undefined}
        >
          FRONTIER
        </a>
      </li>
      <li>
        <a className="nav-link" href={brandHref("/about")}>
          {m.about}
        </a>
      </li>
      <li>
        <a className="nav-link" href={brandHref("/contact")}>
          {m.contact}
        </a>
      </li>
    </>
  );
  const liquidItems: LiquidNavItem[] = [
    { label: m.home, href: brandHref("/"), icon: NimbusIcons.home, fx: "glow" },
    ...groups.map((g) => ({
      label: g.label,
      render: () => (
        <NavGroup
          group={g}
          open={openGroup === g.id}
          onToggle={setGroup}
          onClose={() => setGroup(null)}
          triggerClassName="nimbus-item"
        />
      ),
    })),
    { label: m.lab, href: brandHref("/lab"), fx: "pop" as const },
    { label: "FRONTIER", href: href("/"), fx: "wave" as const },
    { label: m.about, href: brandHref("/about") },
    { label: m.contact, href: brandHref("/contact") },
  ];
  const activeNav =
    route.kind === "editorial"
      ? 4
      : route.page === "home"
        ? 0
        : route.page === "expertise"
          ? 1
          : ["project", "projects"].includes(route.page)
            ? 2
            : ["lab", "model"].includes(route.page)
              ? 3
              : ["about", "portfolio"].includes(route.page)
                ? 5
                : route.page === "contact"
                  ? 6
                  : -1;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.location.hash = brandHref("/search", { q: q.trim() });
  };
  return (
    <header className="av-header" ref={root}>
      <div className="av-header-inner">
        <a className="av-wordmark" href={brandHref("/")} aria-label="ARCHVANTA">
          <BrandMark />
          <span lang="en" dir="ltr">
            ARCHVANTA
          </span>
        </a>
        <LiquidNavbar
          className="av-global-nav"
          ariaLabel={locale === "fa" ? "ناوبری اصلی" : "Main navigation"}
          items={liquidItems}
          active={activeNav}
          tone={theme}
          compact={false}
          sound={false}
        />
        <div className="av-tools">
          <form className="av-search" onSubmit={submit} role="search">
            <Icon name="search" size={16} />
            <input
              id="site-search"
              ref={search}
              aria-label={m.search}
              placeholder={m.search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>
          <div className="av-desktop-language">
            <LangSwitch />
          </div>
          <button
            className="av-compact-language"
            onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
            aria-label={locale === "en" ? "فا — فارسی" : "EN — English"}
          >
            {locale === "en" ? "فا" : "EN"}
          </button>
          <ThemeToggle />
          <UserMenu
            route={
              route.kind === "editorial"
                ? route.route
                : { name: "home", page: 1 }
            }
          />
          <a
            className="av-save"
            href={href("/saved")}
            aria-label={t("nav_saved")}
          >
            <Icon name="bookmark" size={18} />
          </a>
          <button
            ref={trigger}
            className="av-menu"
            onClick={() => setMobile(true)}
            aria-haspopup="dialog"
            aria-label={t("nav_menu")}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="av-mobile-menu"
        aria-label={t("nav_menu")}
        onCancel={() => setMobile(false)}
        onClose={() => {
          setMobile(false);
          trigger.current?.focus();
        }}
      >
        <div className="av-mobile-head">
          <span>ARCHVANTA</span>
          <button
            className="av-menu"
            aria-label={m.close}
            onClick={() => setMobile(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label={t("nav_menu")}>
          <ul>{mobile && nav("mobile-")}</ul>
        </nav>
        <a className="btn" href={brandHref("/portfolio")}>
          {m.portfolio}
        </a>
        <a className="btn" href={href("/saved")}>
          {t("nav_saved")}
        </a>
      </dialog>
    </header>
  );
}
export function EditorialNav({
  route,
}: {
  route: Extract<AppRoute, { kind: "editorial" }>["route"];
}) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => setOpen(null), [route]);
  const groups: MenuGroup[] = [
    {
      id: "editorial-picks",
      label: t("nav_picks"),
      current: route.name === "picks",
      items: (["daily", "weekly", "monthly"] as const).map((id) => ({
        key: id,
        to: `/picks/${id}`,
        art: id,
        tone: "violet",
        title: t(`nav_${id}`),
        desc: t(`menu_${id}_d`),
        current: route.name === "picks" && route.window === id,
      })),
    },
    {
      id: "editorial-categories",
      label: t("nav_categories"),
      current: route.name === "explore",
      items: CATEGORY_IDS.map((id) => ({
        key: id,
        to: "/explore",
        params: { c: id },
        art: id,
        tone: "blue",
        title: categoryLabel(locale, id),
        desc: categoryDescription(locale, id),
        current: route.name === "explore" && route.params.get("c") === id,
      })),
    },
    {
      id: "editorial-sections",
      label: t("nav_sections"),
      current: route.name === "section",
      items: [
        {
          key: "games",
          to: "/ai-games",
          art: "ai-games",
          tone: "violet",
          title: t("nav_ai_games"),
          desc: t("menu_ai_games_d"),
          current: route.name === "section" && route.id === "ai-games",
        },
        {
          key: "data",
          to: "/data-centers",
          art: "data-centers",
          tone: "teal",
          title: t("nav_data_centers"),
          desc: t("menu_data_centers_d"),
          current: route.name === "section" && route.id === "data-centers",
        },
        {
          key: "videos",
          to: "/videos",
          art: "videos",
          tone: "crimson",
          title: t("nav_videos"),
          desc: t("menu_videos_d"),
          current: route.name === "section" && route.id === "videos",
        },
      ],
    },
  ];
  return (
    <div className="av-editorial">
      <a className="av-publication" href={href("/")}>
        <strong>FRONTIER</strong>
        <small>
          {locale === "fa"
            ? "رسانه‌ای از آرک‌ونتا"
            : "AN ARCHVANTA PUBLICATION"}
        </small>
      </a>
      <nav aria-label="FRONTIER">
        <ul>
          <li>
            <a className="nav-link" href={href("/")}>
              {locale === "fa" ? "تازه‌ها" : "Latest"}
            </a>
          </li>
          {groups.map((g) => (
            <NavGroup
              key={g.id}
              group={g}
              open={open === g.id}
              onToggle={setOpen}
              onClose={() => setOpen(null)}
            />
          ))}
          <li>
            <a className="nav-link" href={href("/explore")}>
              {t("nav_explore")}
            </a>
          </li>
          <li>
            <a className="nav-link" href={href("/archive")}>
              {t("nav_archive")}
            </a>
          </li>
          <li>
            <a className="nav-link" href={href("/sources")}>
              {t("nav_sources")}
            </a>
          </li>
          <li>
            <a className="nav-link" href={href("/about")}>
              {t("nav_about")}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
