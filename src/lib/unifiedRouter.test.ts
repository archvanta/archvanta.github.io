import { describe, it, expect } from "vitest";
import { appRoute, brandHref } from "./unifiedRouter";
import { href } from "./router";
import { projectCatalog } from "../content/catalog";
import { portfolio } from "../content/portfolio";
describe("canonical application boundaries", () => {
  it("keeps editorial deep links and legacy aliases on the editorial parser", () => {
    for (const input of [
      "#/frontier/story/2026-10-28/abc123",
      "#/story/2026-10-28/abc123",
    ])
      expect(appRoute(input)).toMatchObject({
        kind: "editorial",
        route: { name: "story", id: "abc123" },
      });
    expect(href("/saved")).toBe("#/frontier/saved");
  });
  it("keeps creator, project and editorial about routes distinct", () => {
    expect(appRoute("#/about")).toMatchObject({ kind: "brand", page: "about" });
    expect(appRoute("#/frontier/about")).toMatchObject({ kind: "editorial" });
    expect(appRoute("#/projects/modular-data-centre")).toMatchObject({
      page: "project",
      slug: "modular-data-centre",
    });
    expect(brandHref("/search", { q: "BIM & architecture" })).toBe(
      "#/search?q=BIM+%26+architecture",
    );
  });
  it("preserves actual portfolio projects separately from concept studies", () => {
    const items = projectCatalog("en");
    expect(items).toHaveLength(12);
    expect(items.filter((p) => p.kind === "concept")).toHaveLength(3);
    expect(portfolio.projects).toHaveLength(9);
    expect(portfolio.objects).toHaveLength(5);
    expect(
      items.find((p) => p.slug === "two-level-facility")?.source?.credit,
    ).toContain("three-person");
  });
});
