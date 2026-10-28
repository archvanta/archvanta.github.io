import { parseHash, type Route } from "./router";
export type BrandPage =
  | "home"
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
  if (head === "projects")
    return { kind: "brand", page: slug ? "project" : "projects", slug, params };
  if (head === "lab")
    return { kind: "brand", page: slug ? "model" : "lab", slug, params };
  if (
    ["expertise", "portfolio", "about", "contact", "search"].includes(
      head || "",
    )
  )
    return { kind: "brand", page: head as BrandPage, slug, params };
  return { kind: "editorial", route: parseHash(hash) };
}
