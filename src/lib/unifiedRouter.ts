import { parseHash, type Route } from "./router";
export type BrandPage =
  | "home"
  | "work"
  | "drawings"
  | "ventures"
  | "venture"
  | "expertise"
  | "projects"
  | "project"
  | "lab"
  | "model"
  | "portfolio"
  | "about"
  | "contact"
  | "search";
export type AppRoute =
  | { kind: "editorial"; route: Route }
  | { kind: "brand"; page: BrandPage; slug?: string; params: URLSearchParams };
export function brandHref(
  path = "/",
  params?: Record<string, string | undefined>,
) {
  const q = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v) q.set(k, v);
  });
  return `#${path}${q.size ? "?" + q : ""}`;
}
export function appRoute(hash: string): AppRoute {
  const raw = hash.replace(/^#/, "") || "/";
  const [path = "/", query = ""] = raw.split("?");
  const params = new URLSearchParams(query);
  const [head, slug] = path
    .split("/")
    .filter(Boolean)
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    });
  if (head === "frontier") return { kind: "editorial", route: parseHash(hash) };
  if (!head || ["home", "perspective", "systems", "process"].includes(head))
    return { kind: "brand", page: "home", params };
  if (head === "work" || head === "projects")
    return { kind: "brand", page: slug ? "project" : "work", slug, params };
  if (head === "drawings") return { kind: "brand", page: "drawings", slug, params };
  if (head === "ventures")
    return { kind: "brand", page: slug ? "venture" : "ventures", slug, params };
  if (head === "lab")
    return slug
      ? { kind: "brand", page: "model", slug, params }
      : { kind: "brand", page: "ventures", params };
  // Older links: the expertise and portfolio pages became the about page.
  if (head === "expertise" || head === "portfolio")
    return { kind: "brand", page: "about", params };
  if (["about", "contact", "search"].includes(head || ""))
    return { kind: "brand", page: head as BrandPage, slug, params };
  return { kind: "editorial", route: parseHash(hash) };
}
