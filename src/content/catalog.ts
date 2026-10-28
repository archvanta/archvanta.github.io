import { projects as concepts, expertise } from "../brand/lib/content";
import { portfolio, tr, type PortfolioProject } from "./portfolio";
import type { Locale } from "../lib/types";
export type ProjectCategory =
  "all" | "architecture" | "data-centers" | "urban" | "concepts" | "bim";
export interface ProjectRecord {
  slug: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  cover: string;
  kind: "portfolio" | "concept";
  source?: PortfolioProject;
  concept?: (typeof concepts)[number];
}
export function projectCatalog(locale: Locale): ProjectRecord[] {
  return [
    ...portfolio.projects.map((p) => ({
      slug: p.slug,
      title: tr(p.title, locale),
      category: tr(p.category, locale),
      status: tr(p.status, locale),
      summary: tr(p.summary, locale),
      cover: p.cover?.src || "/images/threshold.svg",
      kind: "portfolio" as const,
      source: p,
    })),
    ...concepts.map((p) => ({
      slug: p.id,
      title: p.title[locale],
      category: p.category[locale],
      status: locale === "fa" ? "مطالعهٔ مفهومی" : "Concept study",
      summary: p.statement[locale],
      cover: p.image,
      kind: "concept" as const,
      concept: p,
    })),
  ];
}
export function projectMatches(p: ProjectRecord, filter: string) {
  if (filter === "all") return true;
  if (filter === "concepts") return p.kind === "concept";
  if (filter === "bim")
    return (
      p.source?.tools?.includes("Revit") || p.concept?.id === "coordination"
    );
  const cats: Record<string, string> = {
    architecture: "Architecture",
    "data-centers": "Data Center Design",
    urban: "Urban Planning",
  };
  return p.source?.category === cats[filter];
}
export const categories: { id: ProjectCategory; en: string; fa: string }[] = [
  { id: "all", en: "All projects", fa: "همهٔ پروژه‌ها" },
  { id: "data-centers", en: "Data centers", fa: "دیتاسنترها" },
  { id: "architecture", en: "Architecture", fa: "معماری" },
  { id: "bim", en: "BIM", fa: "BIM" },
  { id: "urban", en: "Urban studies", fa: "مطالعات شهری" },
  { id: "concepts", en: "Concept studies", fa: "مطالعات مفهومی" },
];
export { expertise };
