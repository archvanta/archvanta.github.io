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
    expect(appRoute("#/projects/the-last-shadow-of-time")).toMatchObject({
      page: "project",
      slug: "the-last-shadow-of-time",
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
      items.find((p) => p.slug === "the-last-shadow-of-time")?.source?.credit,
    ).toContain("academic supervision");
    expect(
      portfolio.projects.filter((p) => p.category === "Data Center Design"),
    ).toHaveLength(6);
    // Data-center projects carry no images until the owner approves cleared exports.
    for (const p of portfolio.projects.filter((x) => x.category === "Data Center Design")) {
      expect(p.cover, p.slug).toBeUndefined();
      expect(p.gallery ?? [], p.slug).toHaveLength(0);
    }
  });
  it("maps the redesigned sections and keeps older links working", () => {
    expect(appRoute("#/work")).toMatchObject({ kind: "brand", page: "work" });
    expect(appRoute("#/work/ramsar-urban-baseline-study")).toMatchObject({
      page: "project",
      slug: "ramsar-urban-baseline-study",
    });
    expect(appRoute("#/projects")).toMatchObject({ page: "work" });
    const drawings = appRoute("#/drawings?sheet=v35");
    expect(drawings).toMatchObject({ kind: "brand", page: "drawings" });
    expect(drawings.kind === "brand" && drawings.params.get("sheet")).toBe("v35");
    expect(appRoute("#/ventures")).toMatchObject({ page: "ventures" });
    expect(appRoute("#/ventures/frontier")).toMatchObject({ page: "venture", slug: "frontier" });
    expect(appRoute("#/lab")).toMatchObject({ page: "ventures" });
    expect(appRoute("#/lab/tower.glb")).toMatchObject({ page: "model", slug: "tower.glb" });
    expect(appRoute("#/portfolio")).toMatchObject({ page: "about" });
    expect(appRoute("#/expertise")).toMatchObject({ page: "about" });
    expect(appRoute("#/contact")).toMatchObject({ page: "contact" });
    expect(appRoute("#/frontier/")).toMatchObject({ kind: "editorial" });
  });
});
