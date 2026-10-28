import raw from "./portfolio-source.json";
import dictionary from "./portfolio-fa.json";
import extras from "./portfolio-fa-extra.json";
import type { Locale } from "../lib/types";
export interface PortfolioImage {
  src: string;
  label: string;
  caption?: string;
  aspect?: string;
  r?: number;
}
export interface PortfolioProject {
  slug: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  year?: string;
  role?: string;
  credit?: string;
  model?: string;
  tools?: string[];
  kind?: string;
  discipline?: string;
  overview?: string;
  challenge?: string;
  approach?: string;
  solution?: string;
  learned?: string;
  timeline?: string;
  type?: string;
  cover?: PortfolioImage;
  gallery?: PortfolioImage[];
  boards?: { title: string; items: PortfolioImage[] };
  facts?: string[][];
  deliver?: string[];
  proposal?: { pages: number; ratio: number; label: string; tag: string };
}
export const portfolio = raw as unknown as {
  profile: {
    name: string;
    role: string;
    location: string;
    status: string;
    aboutLead: string;
    about: string[];
    email: string;
    socials: { label: string; url: string; handle: string }[];
  };
  experience: { org: string; role: string; duties: string[] }[];
  projects: PortfolioProject[];
  objects: { title: string; file: string; description: string; type: string }[];
  skillGroups: { title: string; items: string[] }[];
  processPhases: string[][];
  home: {
    platforms: {
      items: {
        name: string;
        kind: string;
        url: string;
        body: string;
        features: string[];
        tags: string[];
      }[];
    };
  };
};
export function tr(text: string | undefined, locale: Locale): string {
  if (!text) return "";
  if (locale === "en") return text;
  const map = { ...dictionary, ...extras } as Record<string, string>;
  if (map[text]) return map[text];
  return text
    .split(/(\s+[·—|]\s+|\s+\/\s+)/)
    .map((x) => map[x] || x)
    .join("");
}
export const creatorName = { en: "MohammadAmin Sadeghi", fa: "محمدامین صادقی" };
