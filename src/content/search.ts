import { projectCatalog, expertise } from "./catalog";
import { portfolio, tr } from "./portfolio";
import { brandHref } from "../lib/unifiedRouter";
import type { Locale } from "../lib/types";
export interface LocalSearchResult {
  type: "project" | "expertise" | "lab" | "page";
  title: string;
  description: string;
  href: string;
}
export function localSearch(q: string, locale: Locale): LocalSearchResult[] {
  const norm = (s: string) =>
    s
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک");
  const query = norm(q.trim());
  if (!query) return [];
  return [
    ...projectCatalog(locale).map((p) => ({
      type: "project" as const,
      title: p.title,
      description: p.summary,
      href: brandHref("/projects/" + p.slug),
    })),
    ...expertise.map((e) => ({
      type: "expertise" as const,
      title: e.title[locale],
      description: e.body[locale],
      href: brandHref("/expertise/" + e.id),
    })),
    ...portfolio.objects.map((o) => ({
      type: "lab" as const,
      title: tr(o.title, locale),
      description: o.description,
      href: brandHref("/lab/" + o.file),
    })),
    {
      type: "page" as const,
      title: locale === "fa" ? "محمدامین صادقی" : "MohammadAmin Sadeghi",
      description:
        locale === "fa"
          ? "درباره، سابقه و پورتفولیو"
          : "About, experience and portfolio",
      href: brandHref("/portfolio"),
    },
  ]
    .filter((x) => norm(x.title + " " + x.description).includes(query))
    .slice(0, 30);
}
